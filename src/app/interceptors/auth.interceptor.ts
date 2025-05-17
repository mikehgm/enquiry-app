import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Observable, throwError, BehaviorSubject, filter, switchMap, take, catchError } from 'rxjs';

let isRefreshing = false;
let refreshSubject = new BehaviorSubject<string | null>(null);

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);

  const token = authService.accessToken;
  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && authService.refreshToken && !req.url.includes('/auth/login')) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshSubject.next(null);

          return authService.refreshTokens().pipe(
            switchMap(tokens => {
              isRefreshing = false;
              authService.setTokens(tokens.access_token, tokens.refresh_token);
              refreshSubject.next(tokens.access_token);

              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${tokens.access_token}`
                }
              });

              return next(retryReq);
            }),
            catchError(err => {
              isRefreshing = false;
              authService.logout();
              return throwError(() => err);
            })
          );
        } else {
          return refreshSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap(newToken => {
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next(retryReq);
            })
          );
        }
      }

      return throwError(() => error);
    })
  );
};

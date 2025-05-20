import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import { LoadingService } from '../service/loading.service';

export const LoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(LoadingService);
  const excludedUrls = ['/refresh-token'];

  if (excludedUrls.some(url => req.url.includes(url))) {
    return next(req);
  }

  loading.show();


  return next(req).pipe(
    finalize(() =>  {
      loading.hide();
    })
  );
};

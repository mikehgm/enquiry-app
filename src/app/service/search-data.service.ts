import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SearchDataService {

  private searchTermSubject = new BehaviorSubject<string>('');
  private statusFilterSubject = new BehaviorSubject<number | null>(null);
  searchTerm$ = this.searchTermSubject.asObservable();
  statusFilter$ = this.statusFilterSubject.asObservable();


  constructor() { }

  setSearchTerm(term: string) {
    console.log('Search term:', term);
    this.searchTermSubject.next(term.trim().toLowerCase());
  }

  setStatusFilter(statusId: number | null) {
    this.statusFilterSubject.next(statusId);
  }

  setSearchFilterStates(term: string, statusId: number | null) {
    this.searchTermSubject.next(term.trim().toLowerCase());
    this.statusFilterSubject.next(statusId);
  }
}

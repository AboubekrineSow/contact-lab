import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact, ContactInput } from './contact.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/contacts';

  list(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.baseUrl);
  }

  create(contact: ContactInput): Observable<Contact> {
    return this.http.post<Contact>(this.baseUrl, contact);
  }

  update(id: string, contact: ContactInput): Observable<Contact> {
    return this.http.put<Contact>(`${this.baseUrl}/${id}`, contact);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

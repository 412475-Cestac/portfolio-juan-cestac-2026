import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CONTACT_FORM_ENDPOINT } from '../config/contact-form.config';

export interface ContactFormData {
  name: string;
  email: string;
  projectType: string;
  message: string;
}

type ContactPayload = ContactFormData & {
  source: string;
  submittedAt: string;
  _subject: string;
};

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly endpoint = CONTACT_FORM_ENDPOINT;
  private readonly headers = new HttpHeaders({ Accept: 'application/json' });

  constructor(private readonly http: HttpClient) {}

  sendContactMessage(data: ContactFormData): Observable<unknown> {
    const payload: ContactPayload = {
      ...data,
      source: 'portfolio juancestac',
      submittedAt: new Date().toISOString(),
      _subject: 'Nueva consulta desde portfolio juancestac'
    };

    return this.http.post<unknown>(this.endpoint, payload, { headers: this.headers });
  }
}

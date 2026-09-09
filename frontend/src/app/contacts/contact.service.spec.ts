import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ContactService } from './contact.service';
import { ContactInput } from './contact.model';

describe('ContactService', () => {
  let service: ContactService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('GETs the contact list', () => {
    service.list().subscribe();
    const req = httpMock.expectOne('/api/contacts');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('POSTs a new contact', () => {
    const input = {
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.io',
      favorite: false,
    } as ContactInput;
    service.create(input).subscribe();
    const req = httpMock.expectOne('/api/contacts');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(input);
    req.flush({});
  });

  it('DELETEs by id', () => {
    service.remove('42').subscribe();
    const req = httpMock.expectOne('/api/contacts/42');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});

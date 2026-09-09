import { Component } from '@angular/core';
import { ContactsComponent } from './contacts/contacts.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ContactsComponent],
  template: `
    <main class="container">
      <h1 class="h3 mb-1">Contacts Lab</h1>
      <p class="text-secondary mb-4">
        A tiny Spring Boot + Angular playground — ag-Grid for the list, ngx-formly for the form.
      </p>
      <app-contacts />
    </main>
  `,
})
export class AppComponent {}

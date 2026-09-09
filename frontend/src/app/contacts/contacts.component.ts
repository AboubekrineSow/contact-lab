import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import type {
  ColDef,
  GridApi,
  GridReadyEvent,
  SelectionChangedEvent,
  ValueFormatterParams,
} from 'ag-grid-community';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';

import { Contact, ContactInput } from './contact.model';
import { ContactService } from './contact.service';
import { contactFormFields } from './contact-form.fields';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AgGridAngular, FormlyModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent implements OnInit {
  private readonly service = inject(ContactService);

  readonly rows = signal<Contact[]>([]);
  readonly error = signal<string | null>(null);

  quickFilter = '';
  private selected: Contact | null = null;
  private gridApi?: GridApi<Contact>;

  // form panel state — editing() is null when the panel is hidden
  readonly editing = signal<Contact | null>(null);
  readonly isNew = signal(false);
  form = new FormGroup({});
  model: Partial<ContactInput> = {};
  readonly fields: FormlyFieldConfig[] = contactFormFields;

  readonly defaultColDef: ColDef = { sortable: true, filter: true, resizable: true, flex: 1 };
  readonly columnDefs: ColDef<Contact>[] = [
    {
      field: 'favorite',
      headerName: '★',
      width: 70,
      flex: 0,
      valueFormatter: (p: ValueFormatterParams) => (p.value ? '★' : ''),
    },
    { field: 'firstName', headerName: 'First name' },
    { field: 'lastName', headerName: 'Last name' },
    { field: 'email' },
    { field: 'phone' },
    { field: 'company' },
  ];

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.error.set(null);
    this.service.list().subscribe({
      next: (list) => this.rows.set(list),
      error: () => this.error.set('Could not load contacts. Is the backend running on :8080?'),
    });
  }

  onGridReady(event: GridReadyEvent<Contact>): void {
    this.gridApi = event.api;
  }

  onSelectionChanged(event: SelectionChangedEvent<Contact>): void {
    this.selected = event.api.getSelectedRows()[0] ?? null;
  }

  hasSelection(): boolean {
    return this.selected !== null;
  }

  newContact(): void {
    this.isNew.set(true);
    this.model = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      favorite: false,
    };
    this.form = new FormGroup({});
    this.editing.set({ id: '' } as Contact);
  }

  editSelected(): void {
    if (!this.selected) {
      return;
    }
    this.isNew.set(false);
    const { id: _id, ...rest } = this.selected;
    this.model = { ...rest };
    this.form = new FormGroup({});
    this.editing.set(this.selected);
  }

  cancel(): void {
    this.editing.set(null);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.model as ContactInput;
    const current = this.editing();
    const request =
      this.isNew() || !current?.id
        ? this.service.create(payload)
        : this.service.update(current.id, payload);

    request.subscribe({
      next: () => {
        this.editing.set(null);
        this.reload();
      },
      error: () => this.error.set('Save failed — check the form values.'),
    });
  }

  remove(): void {
    if (!this.selected) {
      return;
    }
    if (!confirm(`Delete ${this.selected.firstName} ${this.selected.lastName}?`)) {
      return;
    }
    this.service.remove(this.selected.id).subscribe({
      next: () => {
        this.selected = null;
        this.reload();
      },
      error: () => this.error.set('Delete failed.'),
    });
  }
}

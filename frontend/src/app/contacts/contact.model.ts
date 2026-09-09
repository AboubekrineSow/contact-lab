export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  favorite: boolean;
}

/** Shape sent to the API when creating/updating (no id). */
export type ContactInput = Omit<Contact, 'id'>;

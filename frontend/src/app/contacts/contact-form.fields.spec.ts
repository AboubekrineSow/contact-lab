import { FormlyFieldConfig } from '@ngx-formly/core';
import { contactFormFields } from './contact-form.fields';

function flatten(fields: FormlyFieldConfig[]): FormlyFieldConfig[] {
  return fields.flatMap((f) => (f.fieldGroup ? flatten(f.fieldGroup) : [f]));
}

describe('contactFormFields', () => {
  it('has a required email field with email validation', () => {
    const email = flatten(contactFormFields).find((f) => f.key === 'email');
    expect(email).toBeTruthy();
    expect(email?.props?.required).toBeTrue();
    expect(email?.validators?.['validation']).toContain('email');
  });

  it('marks first name, last name and email as required', () => {
    const required = flatten(contactFormFields)
      .filter((f) => f.props?.required)
      .map((f) => f.key);
    expect(required).toEqual(jasmine.arrayContaining(['firstName', 'lastName', 'email']));
  });
});

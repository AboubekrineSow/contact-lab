import { FormlyFieldConfig } from '@ngx-formly/core';

/**
 * The whole "add / edit contact" form, described as data.
 * Adding a field here is a good first pull request — see CONTRIBUTING.md.
 */
export const contactFormFields: FormlyFieldConfig[] = [
  {
    fieldGroupClassName: 'row',
    fieldGroup: [
      {
        key: 'firstName',
        type: 'input',
        className: 'col-6',
        props: { label: 'First name', required: true, maxLength: 60 },
      },
      {
        key: 'lastName',
        type: 'input',
        className: 'col-6',
        props: { label: 'Last name', required: true, maxLength: 60 },
      },
    ],
  },
  {
    key: 'email',
    type: 'input',
    props: { label: 'Email', type: 'email', required: true },
    validators: { validation: ['email'] },
  },
  {
    fieldGroupClassName: 'row',
    fieldGroup: [
      {
        key: 'phone',
        type: 'input',
        className: 'col-6',
        props: { label: 'Phone', placeholder: '+222 …' },
      },
      {
        key: 'company',
        type: 'input',
        className: 'col-6',
        props: { label: 'Company', maxLength: 80 },
      },
    ],
  },
  {
    key: 'favorite',
    type: 'checkbox',
    props: { label: 'Favorite' },
  },
];

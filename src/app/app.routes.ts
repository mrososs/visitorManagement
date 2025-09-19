import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'create-form',
    loadComponent: () =>
      import(
        './features/form-builder/components/create-form-page.component'
      ).then((m) => m.CreateFormPageComponent),
  },
  {
    path: 'form-schemas',
    loadComponent: () =>
      import(
        './features/form-builder/components/form-schemas-list/form-schemas-list.component'
      ).then((m) => m.FormSchemasListComponent),
  },
  {
    path: 'list-of-purposes',
    loadComponent: () =>
      import(
        './features/instructions-and-purpose/components/list-of-purposes.component'
      ).then((m) => m.ListOfPurposesComponent),
  },
  {
    path: 'list-of-special-requirements',
    loadComponent: () =>
      import(
        './features/instructions-and-purpose/components/list-of-special-requirements.component'
      ).then((m) => m.ListOfSpecialRequirementsComponent),
  },
  {
    path: 'list-of-entry-instructions',
    loadComponent: () =>
      import(
        './features/instructions-and-purpose/components/list-of-entry-instructions.component'
      ).then((m) => m.ListOfEntryInstructionsComponent),
  },
  {
    path: 'list-of-instructions-to-submit-permit',
    loadComponent: () =>
      import(
        './features/instructions-and-purpose/components/list-of-instructions-to-submit-permit.component'
      ).then((m) => m.ListOfInstructionsToSubmitPermitComponent),
  },
  {
    path: '',
    redirectTo: '/create-form',
    pathMatch: 'full',
  },
];

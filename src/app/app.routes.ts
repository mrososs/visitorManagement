import { Routes } from '@angular/router';

export const routes: Routes = [
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
    redirectTo: '/list-of-purposes',
    pathMatch: 'full',
  },
];

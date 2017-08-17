import { Routes } from '@angular/router';
import { AdminGuard } from '../shared/services/admin.guard';
import { AccessCodesComponent } from './components/access-codes.component';
import { AccessCodesInitComponent } from './components/access-codes-init.component';
import { AccessCodeFormComponent } from './components/access-code-form.component';

export const AccessCodesRoutes: Routes = [
  {
    path: 'access_codes',
    component: AccessCodesComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'new',
        component: AccessCodeFormComponent
      },
      {
        path: ':id',
        component: AccessCodeFormComponent
      },
      {
        path: '',
        component: AccessCodesInitComponent
      }
    ]
  }
];

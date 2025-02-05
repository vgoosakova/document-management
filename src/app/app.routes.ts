import {Routes} from '@angular/router';
import {AuthGuard} from './auth/guards/auth.guard';
import {routerLinks} from './core/enums';

export const routes: Routes = [
  {
    path: routerLinks.auth,
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: routerLinks.dashboard,
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: routerLinks.auth,
    pathMatch: 'full',
  },
];

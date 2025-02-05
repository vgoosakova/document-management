import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardRootComponent} from './containers/dashboard-root/dashboard-root.component';
import {RouterLink, RouterModule, Routes} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {AuthGuard} from '../auth/guards/auth.guard';
import {MatIcon} from '@angular/material/icon';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardRootComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  declarations: [DashboardRootComponent],
  imports: [
    CommonModule,
    RouterLink,
    MatButton,
    RouterModule.forChild(dashboardRoutes),
    MatIcon,
  ]
})
export class DashboardModule {
}

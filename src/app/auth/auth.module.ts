import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RegistrationComponent} from './components/registration/registration.component';
import {routerLinks} from '../core/enums';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';

export const authRoutes: Routes = [
  {
    path: '',
    redirectTo: routerLinks.login,
    pathMatch: 'full',
  },
  {
    path: routerLinks.login,
    component: LoginComponent,
  },
  {
    path: routerLinks.register,
    component: RegistrationComponent,
  },
];

@NgModule({
  declarations: [LoginComponent, RegistrationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(authRoutes),
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatProgressBar,
    MatOption,
    MatSelect,
  ],
})
export class AuthModule {
}

import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngxs/store';
import {Login} from '../../state/auth.actions';
import {routerLinks} from '../../../core/enums';
import {Observable} from 'rxjs';
import {AuthState} from '../../state/auth.state';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  isLoading$: Observable<boolean> = inject(Store).select(AuthState.isLoading);
  formGroup: FormGroup;
  protected readonly routerLinks = routerLinks;

  constructor(private readonly fb: FormBuilder, private readonly store: Store) {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.formGroup.get('email')!;
  }

  get password() {
    return this.formGroup.get('password')!;
  }

  getEmailError(): string {
    if (this.email.hasError('required')) return 'Email is required';
    if (this.email.hasError('email')) return 'Invalid email format';
    return '';
  }

  getPasswordError(): string {
    if (this.password.hasError('required')) return 'Password is required';
    if (this.password.hasError('minlength')) return 'Password must be at least 6 characters';
    return '';
  }

  onSubmit() {
    if (this.formGroup.valid) {
      this.store.dispatch(new Login(this.formGroup.value));
    }
  }
}

import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngxs/store';
import {Registration} from '../../state/auth.actions';
import {routerLinks, UserRole} from '../../../core/enums';
import {RegisterData} from '../../state/auth.model';
import {Observable} from 'rxjs';
import {AuthState} from '../../state/auth.state';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationComponent {
  isLoading$: Observable<boolean> = inject(Store).select(AuthState.isLoading);
  formGroup: FormGroup;
  protected readonly routerLinks = routerLinks;

  constructor(private readonly fb: FormBuilder, private readonly store: Store) {
    this.formGroup = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {validator: this.passwordsMatchValidator});
  }

  get fullName() {
    return this.formGroup.get('fullName')!;
  }

  get email() {
    return this.formGroup.get('email')!;
  }

  get password() {
    return this.formGroup.get('password')!;
  }

  get confirmPassword() {
    return this.formGroup.get('confirmPassword')!;
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

  getConfirmPasswordError(): string {
    if (this.confirmPassword.hasError('required')) return 'Please confirm your password';
    if (this.formGroup.hasError('passwordMismatch')) return 'Passwords do not match';
    return '';
  }

  getFullNameError(): string {
    if (this.fullName.hasError('required')) return 'Full name is required';
    if (this.fullName.hasError('minlength')) return 'Full name must be at least 3 characters';
    return '';
  }

  passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : {passwordMismatch: true};
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const userRole = this.email.value.includes('reviewer') ? UserRole.reviewer : UserRole.user
      const formData: RegisterData = {
        email: this.email.value,
        password: this.password.value,
        fullName: this.fullName.value,
        role: userRole
      }
      this.store.dispatch(new Registration(formData));
    }
  }
}

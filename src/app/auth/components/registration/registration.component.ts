import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormBuilder, ValidatorFn, Validators} from '@angular/forms';
import {Store} from '@ngxs/store';
import {Registration} from '../../state/auth.actions';
import {routerLinks} from '../../../core/enums';
import {RegisterData, UserRole} from '../../state/auth.model';
import {Observable} from 'rxjs';
import {AuthState} from '../../state/auth.state';

/** Custom validator to check if passwords match */
const passwordsMatchValidator: ValidatorFn = (group) => {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : {passwordMismatch: true};
};

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationComponent {
  protected readonly routerLinks = routerLinks;
  private readonly store = inject(Store);
  readonly isLoading$: Observable<boolean> = this.store.select(AuthState.isLoading);
  private readonly fb = inject(FormBuilder);
  readonly formGroup = this.fb.nonNullable.group(
    {
      fullName: this.fb.control<string>('', {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      email: this.fb.control<string>('', {
        validators: [Validators.required, Validators.email]
      }),
      password: this.fb.control<string>('', {
        validators: [Validators.required, Validators.minLength(6)]
      }),
      confirmPassword: this.fb.control<string>('', {
        validators: [Validators.required]
      })
    },
    {validators: passwordsMatchValidator}
  );

  public get fullName() {
    return this.formGroup.controls.fullName;
  }

  public get email() {
    return this.formGroup.controls.email;
  }

  public get password() {
    return this.formGroup.controls.password;
  }

  public get confirmPassword() {
    return this.formGroup.controls.confirmPassword;
  }

  public get emailError(): string {
    if (this.email.hasError('required')) return 'Email is required';
    if (this.email.hasError('email')) return 'Invalid email format';
    return '';
  }

  public get passwordError(): string {
    if (this.password.hasError('required')) return 'Password is required';
    if (this.password.hasError('minlength')) return 'Password must be at least 6 characters';
    return '';
  }

  public get confirmPasswordError(): string {
    if (this.confirmPassword.hasError('required')) return 'Please confirm your password';
    if (this.formGroup.hasError('passwordMismatch')) return 'Passwords do not match';
    return '';
  }

  public get fullNameError(): string {
    if (this.fullName.hasError('required')) return 'Full name is required';
    if (this.fullName.hasError('minlength')) return 'Full name must be at least 3 characters';
    return '';
  }

  public onSubmit() {
    if (this.formGroup.valid) {
      const userRole = this.email.value!.includes('reviewer') ? UserRole.reviewer : UserRole.user;
      const formData: RegisterData = {
        email: this.email.value!,
        password: this.password.value!,
        fullName: this.fullName.value!,
        role: userRole
      };
      this.store.dispatch(new Registration(formData));
    }
  }
}

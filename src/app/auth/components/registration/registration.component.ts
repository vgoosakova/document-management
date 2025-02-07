import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {FormBuilder, ValidatorFn, Validators} from '@angular/forms';
import {Store} from '@ngxs/store';
import {Registration} from '../../state/auth.actions';
import {routerLinks} from '../../../core/enums';
import {RegisterData, UserRole} from '../../state/auth.model';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent {
  readonly roleError = computed(() => {
    if (this.role.hasError('required')) return 'Role is required';
    return '';
  });
  readonly emailError = computed(() => {
    if (this.email.hasError('required')) return 'Email is required';
    if (this.email.hasError('email')) return 'Invalid email format';
    return '';
  });
  readonly passwordError = computed(() => {
    if (this.password.hasError('required')) return 'Password is required';
    if (this.password.hasError('minlength')) return 'Password must be at least 6 characters';
    return '';
  });
  readonly confirmPasswordError = computed(() => {
    if (this.confirmPassword.hasError('required')) return 'Please confirm your password';
    if (this.confirmPassword.hasError('passwordMismatch')) return 'Passwords do not match';
    return '';
  });
  readonly fullNameError = computed(() => {
    if (this.fullName.hasError('required')) return 'Full name is required';
    if (this.fullName.hasError('minlength')) return 'Full name must be at least 3 characters';
    return '';
  });
  protected readonly routerLinks = routerLinks;
  protected readonly userRole = UserRole;
  private readonly store = inject(Store);
  readonly isLoading$ = this.store.select(AuthState.isLoading);
  private readonly fb = inject(FormBuilder);
  readonly formGroup = this.fb.nonNullable.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      role: [null as UserRole | null, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    },
    {validators: passwordsMatchValidator}
  );

  public get fullName() {
    return this.formGroup.controls.fullName;
  }

  public get role() {
    return this.formGroup.controls.role;
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

  onSubmit() {
    if (this.formGroup.valid) {
      const {fullName, email, password, role} = this.formGroup.value;
      const formData: RegisterData = {fullName: fullName!, email: email!, password: password!, role: role!};
      this.store.dispatch(new Registration(formData));
    }
  }
}

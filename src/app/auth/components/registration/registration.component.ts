import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {AbstractControl, FormBuilder, ValidationErrors, Validators} from '@angular/forms';
import {Store} from '@ngxs/store';
import {Registration} from '../../state/auth.actions';
import {routerLinks} from '../../../core/enums';
import {RegisterData, UserRole} from '../../state/auth.model';
import {AuthState} from '../../state/auth.state';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent {
  protected readonly routerLinks = routerLinks;
  protected readonly userRole = UserRole;
  private readonly fb = inject(FormBuilder);
  readonly formGroup = this.fb.nonNullable.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      role: [null as UserRole | null, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, this.passwordsMatchValidator]]
    },
  );
  private readonly store = inject(Store);
  readonly isLoading$ = this.store.select(AuthState.isLoading);
  private readonly emailValue = toSignal(this.email.valueChanges, {initialValue: this.email.value});
  readonly emailError = computed(() => {
    this.emailValue();
    if (this.email.hasError('required')) return 'Email is required';
    if (this.email.hasError('email')) return 'Invalid email format';
    return '';
  });

  private readonly roleValue = toSignal(this.role.valueChanges, {initialValue: this.role.value});
  readonly roleError = computed(() => {
    this.roleValue();
    if (this.role.hasError('required')) return 'Role is required';
    return '';
  });

  private readonly fullNameValue = toSignal(this.fullName.valueChanges, {initialValue: this.fullName.value});
  readonly fullNameError = computed(() => {
    this.fullNameValue();
    if (this.fullName.hasError('required')) return 'Full name is required';
    if (this.fullName.hasError('minlength')) return 'Full name must be at least 3 characters';
    return '';
  });

  private readonly passwordValue = toSignal(this.password.valueChanges, {initialValue: this.password.value});
  readonly passwordError = computed(() => {
    this.passwordValue();
    if (this.password.hasError('required')) return 'Password is required';
    if (this.password.hasError('minlength')) return 'Password must be at least 6 characters';
    return '';
  });

  private readonly confirmPasswordValue = toSignal(this.confirmPassword.valueChanges, {initialValue: this.confirmPassword.value});
  readonly confirmPasswordError = computed(() => {
    this.confirmPasswordValue();
    if (this.confirmPassword.hasError('required')) return 'Please confirm your password';
    if (this.confirmPassword.hasError('passwordMismatch')) return 'Passwords do not match';
    return '';
  });

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


  private passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.parent?.get('password');
    const confirmPassword = control.parent?.get('confirmPassword');
    return password?.value == confirmPassword?.value ? null : {'passwordMismatch': true};
  }
}

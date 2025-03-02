import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Store} from '@ngxs/store';
import {Login} from '../../state/auth.actions';
import {routerLinks} from '../../../core/enums';
import {Observable} from 'rxjs';
import {AuthState} from '../../state/auth.state';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  protected readonly routerLinks = routerLinks;
  private readonly store = inject(Store);
  readonly isLoading$: Observable<boolean> = this.store.select(AuthState.isLoading);
  private readonly fb = inject(FormBuilder);
  readonly formGroup = this.fb.nonNullable.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    },
  );

  private readonly emailValue = toSignal(this.email.valueChanges, {initialValue: this.email.value});
  readonly emailError = computed(() => {
    this.emailValue();
    if (this.email.hasError('required')) return 'Email is required';
    if (this.email.hasError('email')) return 'Invalid email format';
    return '';
  });

  private readonly passwordValue = toSignal(this.password.valueChanges, {initialValue: this.password.value});
  readonly passwordError = computed(() => {
    this.passwordValue();
    if (this.password.hasError('required')) return 'Password is required';
    if (this.password.hasError('minlength')) return 'Password must be at least 6 characters';
    return '';
  });

  public get email() {
    return this.formGroup.controls.email;
  }

  public get password() {
    return this.formGroup.controls.password;
  }

  public onSubmit(): void {
    if (this.formGroup.valid) {
      this.store.dispatch(new Login(this.formGroup.getRawValue()));
    }
  }
}

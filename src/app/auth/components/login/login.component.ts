import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
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
  protected readonly routerLinks = routerLinks;
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  readonly isLoading$: Observable<boolean> = this.store.select(AuthState.isLoading);

  readonly formGroup: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }> = this.fb.group({
    email: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)]
    })
  });

  public get email() {
    return this.formGroup.controls.email;
  }

  public get password() {
    return this.formGroup.controls.password;
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

  public onSubmit(): void {
    if (this.formGroup.valid) {
      this.store.dispatch(new Login(this.formGroup.getRawValue()));
    }
  }
}

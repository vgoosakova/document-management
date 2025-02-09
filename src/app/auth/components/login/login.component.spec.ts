import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {Store} from '@ngxs/store';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReactiveFormsModule} from '@angular/forms';
import {provideRouter, RouterModule} from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {of} from 'rxjs';
import {Login} from '../../state/auth.actions';

const storeMock = {
  dispatch: jasmine.createSpy('dispatch'),
  select: jasmine.createSpy('select').and.returnValue(of(false)),
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        MatCardModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        RouterModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [provideRouter([]), {provide: Store, useValue: storeMock}]
    })
      .compileComponents();
    storeMock.dispatch.calls.reset();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.formGroup.value).toEqual({email: '', password: ''});
  });

  it('should show validation errors when email is invalid', () => {
    component.email.setValue('invalid-email');
    component.email.markAsTouched();
    fixture.detectChanges();
    expect(component.emailError()).toBe('Invalid email format');
  });

  it('should show validation errors when password is too short', () => {
    component.password.setValue('123');
    component.password.markAsTouched();
    fixture.detectChanges();
    expect(component.passwordError()).toBe('Password must be at least 6 characters');
  });

  it('should dispatch Login action when form is valid', () => {
    component.email.setValue('test@example.com');
    component.password.setValue('password123');
    component.onSubmit();
    expect(storeMock.dispatch).toHaveBeenCalledWith(new Login({email: 'test@example.com', password: 'password123'}));
  });

  it('should not dispatch Login action when form is invalid', () => {
    component.email.setValue('invalid-email');
    component.password.setValue('123');
    component.formGroup.markAllAsTouched();
    component.formGroup.updateValueAndValidity();
    fixture.detectChanges();
    component.onSubmit();
    expect(component.formGroup.valid).toBeFalse();
    expect(storeMock.dispatch).not.toHaveBeenCalled();
  });
});

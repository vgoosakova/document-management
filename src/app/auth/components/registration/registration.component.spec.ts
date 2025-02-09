import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RegistrationComponent} from './registration.component';
import {Store} from '@ngxs/store';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {ReactiveFormsModule} from '@angular/forms';
import {provideRouter, RouterModule} from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {of} from 'rxjs';
import {UserRole} from '../../state/auth.model';
import {Registration} from '../../state/auth.actions';

const storeMock = {
  dispatch: jasmine.createSpy('dispatch'),
  select: jasmine.createSpy('select').and.returnValue(of(false)),
};

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrationComponent],
      imports: [
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        ReactiveFormsModule,
        RouterModule,
        MatInputModule,
        BrowserAnimationsModule

      ],
      providers: [provideRouter([]), {provide: Store, useValue: storeMock}]
    })
      .compileComponents();

    storeMock.dispatch.calls.reset();
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.formGroup.value).toEqual({
      fullName: '',
      role: null,
      email: '',
      password: '',
      confirmPassword: ''
    });
  });

  it('should show validation errors when email is invalid', () => {
    component.email.setValue('invalid-email');
    component.email.markAsTouched();
    fixture.detectChanges();
    expect(component.emailError()).toBe('Invalid email format');
  });

  it('should show validation errors when fullName is too short', () => {
    component.fullName.setValue('ab');
    component.fullName.markAsTouched();
    fixture.detectChanges();
    expect(component.fullNameError()).toBe('Full name must be at least 3 characters');
  });

  it('should show validation errors when password is too short', () => {
    component.password.setValue('123');
    component.password.markAsTouched();
    fixture.detectChanges();
    expect(component.passwordError()).toBe('Password must be at least 6 characters');
  });

  it('should show validation errors when passwords do not match', () => {
    component.password.setValue('password123');
    component.confirmPassword.setValue('password321');
    component.confirmPassword.markAsTouched();
    fixture.detectChanges();
    expect(component.confirmPasswordError()).toBe('Passwords do not match');
  });

  it('should dispatch Registration action when form is valid', () => {
    component.fullName.setValue('Test user');
    component.role.setValue(UserRole.user);
    component.email.setValue('test@example.com');
    component.password.setValue('password123');
    component.confirmPassword.setValue('password123');
    component.onSubmit();
    expect(storeMock.dispatch).toHaveBeenCalledWith(
      new Registration({fullName: 'Test user', email: 'test@example.com', password: 'password123', role: UserRole.user})
    );
  });

  it('should not dispatch Registration action when form is invalid', () => {
    component.email.setValue('invalid-email');
    component.password.setValue('123');
    component.confirmPassword.setValue('321');
    component.formGroup.markAllAsTouched();
    component.formGroup.updateValueAndValidity();
    fixture.detectChanges();
    component.onSubmit();
    expect(component.formGroup.valid).toBeFalse();
    expect(storeMock.dispatch).not.toHaveBeenCalled();
  });
});

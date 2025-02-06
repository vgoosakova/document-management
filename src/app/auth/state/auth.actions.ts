import {LoginData, RegisterData, User} from './auth.model';
import {HttpErrorResponse} from '@angular/common/http';

/** Unique identifier of the related state. */
const uniqueStateIdentifier = '[Trainings]';

export class Login {
  static readonly type = `${uniqueStateIdentifier} ${Login.name}`;

  constructor(public user: LoginData) {
  }
}

export class LoginSuccess {
  static readonly type = `${uniqueStateIdentifier} ${LoginSuccess.name}`;

  constructor(public token: string) {
  }
}

export class LoginFail {
  static readonly type = `${uniqueStateIdentifier} ${LoginFail.name}`;

  constructor(public error: HttpErrorResponse) {
  }
}

export class LoadUser {
  static readonly type = `${uniqueStateIdentifier} ${LoadUser.name}`;
}

export class LoadUserSuccess {
  static readonly type = `${uniqueStateIdentifier} ${LoadUserSuccess.name}`;

  constructor(public user: User) {
  }
}

export class Registration {
  static readonly type = `${uniqueStateIdentifier} ${Registration.name}`;

  constructor(public user: RegisterData) {
  }
}

export class RegistrationSuccess {
  static readonly type = `${uniqueStateIdentifier} ${RegistrationSuccess.name}`;

  constructor(public user: User) {
  }
}

export class RegistrationFail {
  static readonly type = `${uniqueStateIdentifier} ${RegistrationFail.name}`;

  constructor(public error: HttpErrorResponse) {
  }
}

export class Logout {
  static readonly type = `${uniqueStateIdentifier} ${Logout.name}`;
}

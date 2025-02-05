import {UserRole} from '../../core/enums';

export interface AuthStateModel {
  loading: boolean;
  loaded: boolean;
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

export const DEFAULT_AUTH_STATE: AuthStateModel = {
  loading: false,
  loaded: false,
  user: null,
  token: null,
  isAuthenticated: false,
};

export interface AccessToken {
  access_token: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}

export interface LoginData {
  email: string;
  password: string;
}

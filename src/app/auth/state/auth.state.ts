import {Action, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import {
  LoadUser,
  LoadUserSuccess,
  Login,
  LoginFail,
  LoginSuccess,
  Logout,
  Registration,
  RegistrationFail,
} from './auth.actions';
import {AuthStateModel, defaultAuthState} from './auth.model';
import {inject, Injectable} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Navigate} from '@ngxs/router-plugin';
import {routerLinks} from '../../core/enums';
import {ErrorHandlerService} from '../../shared/services/error-handler.service';

@State<AuthStateModel>({
  name: 'auth',
  defaults: defaultAuthState,
})
@Injectable()
export class AuthState implements NgxsOnInit {
  private auth = inject(AuthService);
  private errorHandler = inject(ErrorHandlerService);

  @Selector()
  static user(state: AuthStateModel): AuthStateModel['user'] {
    return state.user;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel): AuthStateModel['isAuthenticated'] {
    return state.isAuthenticated;
  }

  @Selector()
  static isLoading(state: AuthStateModel): boolean {
    return state.loading;
  }

  ngxsOnInit(ctx: StateContext<AuthStateModel>) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      ctx.patchState({
        token,
        isAuthenticated: true,
      });

      ctx.dispatch(new LoadUser());
    }
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, {user}: Login) {
    ctx.patchState({loading: true, loaded: false});
    this.auth.login(user).subscribe({
      next: token => ctx.dispatch(new LoginSuccess(token.access_token)),
      error: err => ctx.dispatch(new LoginFail(err)),
    });
  }

  @Action(LoginSuccess)
  loginSuccess(ctx: StateContext<AuthStateModel>, {token}: LoginSuccess) {
    localStorage.setItem('auth_token', token);
    ctx.patchState({
      token,
      isAuthenticated: true,
      loaded: true,
      loading: false
    });
    ctx.dispatch(new LoadUser());
    ctx.dispatch(new Navigate([routerLinks.dashboard]));
  }

  @Action(LoginFail)
  loginFail(ctx: StateContext<AuthStateModel>, {error}: LoginFail) {
    ctx.patchState({loading: false, loaded: false});
    this.errorHandler.showErrorMessage(error.error.message);
  }

  @Action(LoadUser)
  loadUser(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({loaded: false, loading: true})
    this.auth.getUser().subscribe({
      next: user => ctx.dispatch(new LoadUserSuccess(user)),
      error: error => {
        this.errorHandler.showErrorMessage(error.error.message);
        ctx.dispatch(new Logout())
      },
    });
  }

  @Action(LoadUserSuccess)
  loadUserSuccess(ctx: StateContext<AuthStateModel>, {user}: LoadUserSuccess) {
    ctx.patchState({user, loaded: true, loading: false})
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    localStorage.removeItem('auth_token');
    ctx.patchState({
      loading: false,
      loaded: false,
      token: null,
      isAuthenticated: false,
      user: null,
    });
    ctx.dispatch(new Navigate(['/', routerLinks.auth, routerLinks.login]));
  }


  @Action(Registration)
  registration(ctx: StateContext<AuthStateModel>, {user}: Registration) {
    ctx.patchState({
      loading: true,
      loaded: false,
    });
    this.auth.registration(user).subscribe({
      next: () => ctx.dispatch(new Login({email: user.email, password: user.password})),
      error: err => ctx.dispatch(new RegistrationFail(err)),
    });
  }

  @Action(RegistrationFail)
  actionFail(ctx: StateContext<AuthStateModel>, {error}: RegistrationFail) {
    ctx.patchState({
      loading: false,
      loaded: false,
    });

    this.errorHandler.showErrorMessage(error.error.message);
  }
}

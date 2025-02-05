import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable, tap} from 'rxjs';
import {Store} from '@ngxs/store';
import {AuthState} from '../state/auth.state';
import {Navigate} from '@ngxs/router-plugin';
import {routerLinks} from '../../core/enums';
import {Injectable} from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly store: Store) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.store.select(AuthState.isAuthenticated).pipe(
      tap(isAuthenticated => {
        console.log(isAuthenticated)
        if (!isAuthenticated) {
          const redirect = state.url === '/' || state.url === '' ? null : state.url;
          console.log(redirect)
          this.store.dispatch(new Navigate(['/', routerLinks.auth, routerLinks.login], {redirect}));
          return false;
        }
        return true;
      })
    );
  }
}

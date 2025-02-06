import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

import {catchError, Observable, throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import {Store} from '@ngxs/store';
import {Logout} from '../auth/state/auth.actions';

/**
 * AuthTokenInterceptor
 *
 * Intercepts HTTP requests to automatically add Authorization header with Bearer token.
 * Also handles 401 Unauthorized errors by triggering a logout action.
 */
@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(private store: Store) {
  }

  /**
   * Intercepts all HTTP requests and adds an Authorization header if a token is available.
   * Handles unauthorized errors (401) by dispatching a logout action.
   *
   * @param request - The outgoing HTTP request.
   * @param next - The HTTP handler to pass the modified request.
   * @returns Observable<HttpEvent<any>>
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.store.selectSnapshot(state => state.auth.token);

    if (token) {
      request = this.addTokenToRequest(request, token);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle Unauthorized (401) errors
        if (error.status === 401) {
          this.store.dispatch(new Logout());
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Adds an Authorization header with Bearer token to the request.
   *
   * @param request - The original request.
   * @param token - The authentication token.
   * @returns HttpRequest<any> - The modified request with an Authorization header.
   */
  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

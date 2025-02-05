import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {AuthGuard} from './auth/guards/auth.guard';
import {AuthService} from './auth/services/auth.service';
import {NgxsModule} from '@ngxs/store';
import {AuthState} from './auth/state/auth.state';
import {NgxsRouterPluginModule} from '@ngxs/router-plugin';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    importProvidersFrom(NgxsModule.forRoot([AuthState]), NgxsRouterPluginModule.forRoot()),
    AuthGuard,
    AuthService,
  ]
};

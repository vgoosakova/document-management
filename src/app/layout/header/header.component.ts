import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {Observable} from 'rxjs';
import {AuthStateModel} from '../../auth/state/auth.model';
import {AuthState} from '../../auth/state/auth.state';
import {Store} from '@ngxs/store';
import {CommonModule} from '@angular/common';
import {Logout} from '../../auth/state/auth.actions';
import {routerLinks} from '../../core/enums';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    MatToolbarModule,
    MatIcon,
    MatButton,
    CommonModule,
    RouterLinkActive
  ]
})
export class HeaderComponent {
  protected readonly routerLinks = routerLinks;
  private readonly store = inject(Store);
  user$: Observable<AuthStateModel['user']> = this.store.select(AuthState.user);

  logout() {
    this.store.dispatch(new Logout());
  }
}

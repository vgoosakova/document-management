import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-dashboard-root',
  templateUrl: './dashboard-root.component.html',
  styleUrl: './dashboard-root.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardRootComponent {
}

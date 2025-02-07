import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DocumentsDashboardRootComponent} from './containers/dashboard-root/documents-dashboard-root.component';
import {RouterLink, RouterModule, Routes} from '@angular/router';
import {MatButton, MatIconButton} from '@angular/material/button';
import {AuthGuard} from '../auth/guards/auth.guard';
import {MatIcon} from '@angular/material/icon';
import {NgxsModule} from '@ngxs/store';
import {DocumentsDashboardState} from './state/documents-dashboard.state';
import {DocumentsDashboardService} from './services/documents-dashboard.service';
import {
  DocumentsDashboardTableComponent
} from './components/documents-dashboard-table/documents-dashboard-table.component';
import {MatTableModule} from '@angular/material/table';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatPaginator} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {
  DocumentsDashboardFiltersComponent
} from './components/documents-dashboard-filters/documents-dashboard-filters.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {
  DocumentsDashboardEditDialogComponent
} from './components/documents-dashboard-edit-dialog/documents-dashboard-edit-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {
  DocumentsDashboardCreateDialogComponent
} from './components/documents-dashboard-create-dialog/documents-dashboard-create-dialog.component';
import {
  DocumentsDashboardDocumentComponent
} from './containers/documents-dashboard-document/documents-dashboard-document.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DocumentsDashboardRootComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':id',
    component: DocumentsDashboardDocumentComponent,
  }
];

@NgModule({
  declarations: [
    DocumentsDashboardRootComponent,
    DocumentsDashboardTableComponent,
    DocumentsDashboardFiltersComponent,
    DocumentsDashboardEditDialogComponent,
    DocumentsDashboardCreateDialogComponent,
    DocumentsDashboardDocumentComponent
  ],
  imports: [
    CommonModule,
    RouterLink,
    MatButton,
    RouterModule.forChild(dashboardRoutes),
    MatIcon,
    NgxsModule.forFeature([DocumentsDashboardState]),
    MatTableModule,
    MatIconButton,
    MatProgressBar,
    MatPaginator,
    MatSortModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatInput,
    MatTooltipModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  providers: [DocumentsDashboardService]
})
export class DocumentsDashboardModule {
}

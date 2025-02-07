import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, Signal} from '@angular/core';
import {Store} from '@ngxs/store';
import {CreateDocument, LoadDocumentsList} from '../../state/documents-dashboard.actions';
import {DocumentsDashboardState} from '../../state/documents-dashboard.state';
import {DocumentModel, DocumentsListFilters, DocumentStateModel} from '../../state/documents-dashboard.model';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {filter, Observable} from 'rxjs';
import {progressStatuses} from '../../../core/enums';
import {AuthState} from '../../../auth/state/auth.state';
import {AuthStateModel, UserRole} from '../../../auth/state/auth.model';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {
  DocumentsDashboardCreateDialogComponent
} from '../../components/documents-dashboard-create-dialog/documents-dashboard-create-dialog.component';

@Component({
  selector: 'app-documents-dashboard-root',
  templateUrl: './documents-dashboard-root.component.html',
  styleUrl: './documents-dashboard-root.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentsDashboardRootComponent implements OnInit {
  protected readonly progressStatuses = progressStatuses;
  protected readonly userRole = UserRole;
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(Store);
  readonly user$: Observable<AuthStateModel['user']> = this.store.select(AuthState.user);
  readonly loadDocumentsListStatus$: Observable<DocumentStateModel['loadDocumentsListStatus']> = this.store.select(DocumentsDashboardState.loadDocumentsListStatus);
  readonly manageDocumentStatus$: Observable<DocumentStateModel['manageDocumentStatus']> = this.store.select(DocumentsDashboardState.manageDocumentStatus);
  readonly performDocumentActionStatus$: Observable<DocumentStateModel['performDocumentActionStatus']> = this.store.select(DocumentsDashboardState.performDocumentActionStatus);
  documentsList: Signal<DocumentModel[]> = toSignal(
    this.store.select(DocumentsDashboardState.documentsList),
    {initialValue: []}
  );
  private readonly dialog = inject(MatDialog);

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => this.fetchDocuments({
        page: +params['page'] || 1,
        size: +params['size'] || 10,
        sort: params['sort'] ?? null,
        status: params['status'] ?? null,
        creator: params['creator'] ?? null
      }));
  }

  fetchDocuments(filters: DocumentsListFilters) {
    this.store.dispatch(new LoadDocumentsList(filters));
  }

  onFiltersChanged(filters: Partial<DocumentsListFilters>) {
    const queryParams: Partial<DocumentsListFilters> = {
      page: (filters.page ?? Number(this.activatedRoute.snapshot.queryParams['page'])) || 1,
      size: (filters.size ?? Number(this.activatedRoute.snapshot.queryParams['size'])) || 10,
      sort: filters.sort ?? this.activatedRoute.snapshot.queryParams['sort'],
      status: filters.status?.toString() !== 'all' ? filters.status ?? this.activatedRoute.snapshot.queryParams['status'] : undefined,
      creator: filters.creator ? filters.creator ?? this.activatedRoute.snapshot.queryParams['creator'] : undefined,
    };

    this.router.navigate([], {
      queryParams: Object.fromEntries(Object.entries(queryParams).filter(([_, v]) => v != null))
    });
  }

  openAddDocumentDialog(): void {
    const dialogRef = this.dialog.open(DocumentsDashboardCreateDialogComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().pipe(filter(Boolean)).subscribe((formData: FormData) => {
      this.store.dispatch(new CreateDocument(formData));
    });
  }
}

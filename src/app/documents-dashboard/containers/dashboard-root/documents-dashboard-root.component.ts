import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, Signal} from '@angular/core';
import {Store} from '@ngxs/store';
import {LoadDocumentsList} from '../../state/documents-dashboard.actions';
import {DocumentsDashboardState} from '../../state/documents-dashboard.state';
import {DocumentModel, DocumentsListFilters, DocumentStateModel} from '../../state/documents-dashboard.model';
import {toSignal} from '@angular/core/rxjs-interop';
import {Observable, Subject} from 'rxjs';
import {progressStatuses} from '../../../core/enums';
import {AuthState} from '../../../auth/state/auth.state';
import {AuthStateModel, UserRole} from '../../../auth/state/auth.model';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-documents-dashboard-root',
  templateUrl: './documents-dashboard-root.component.html',
  styleUrl: './documents-dashboard-root.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentsDashboardRootComponent implements OnInit, OnDestroy {
  protected readonly progressStatuses = progressStatuses;
  protected readonly userRole = UserRole;
  private readonly destroy$ = new Subject<void>();
  private readonly store = inject(Store);
  readonly user$: Observable<AuthStateModel['user']> = this.store.select(AuthState.user);
  readonly loadDocumentsListStatus$: Observable<DocumentStateModel['loadDocumentsListStatus']> = this.store.select(DocumentsDashboardState.loadDocumentsListStatus);
  documentsList: Signal<DocumentModel[]> = toSignal(
    this.store.select(DocumentsDashboardState.documentsList),
    {initialValue: []}
  );

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const filters: DocumentsListFilters = {
        page: Number(params['page']) || 1,
        size: Number(params['size']) || 10,
        sort: params['sort'] || null,
        status: params['status'] || null,
        creator: params['creator'] || null
      };

      this.fetchDocuments(filters);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchDocuments(filters: DocumentsListFilters) {
    this.store.dispatch(new LoadDocumentsList(filters));
  }

  onFiltersChanged(filters: Partial<DocumentsListFilters>) {
    console.log(filters)
    const queryParams: Partial<DocumentsListFilters> = {
      page: (filters.page ?? Number(this.activatedRoute.snapshot.queryParams['page'])) || 1,
      size: (filters.size ?? Number(this.activatedRoute.snapshot.queryParams['size'])) || 10,
      sort: filters.sort ?? this.activatedRoute.snapshot.queryParams['sort'],
      status: filters.status?.toString() !== 'all' ? filters.status ?? this.activatedRoute.snapshot.queryParams['status'] : undefined,
      creator: filters.creator ? filters.creator ?? this.activatedRoute.snapshot.queryParams['creator'] : undefined,
    };

    Object.keys(queryParams).forEach(key => {
      if (queryParams[key as keyof Partial<DocumentsListFilters>] === undefined || queryParams[key as keyof Partial<DocumentsListFilters>] === null) {
        delete queryParams[key as keyof Partial<DocumentsListFilters>];
      }
    });

    this.router.navigate([], {queryParams});
  }
}

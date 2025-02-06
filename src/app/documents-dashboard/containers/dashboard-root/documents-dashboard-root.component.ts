import {ChangeDetectionStrategy, Component, computed, OnInit, signal, Signal} from '@angular/core';
import {Store} from '@ngxs/store';
import {LoadDocumentsList} from '../../state/documents-dashboard.actions';
import {DocumentsDashboardState} from '../../state/documents-dashboard.state';
import {
  DocumentModel,
  DocumentsListFilters,
  DocumentStateModel,
  DocumentStatus,
  documentStatusRelatedNames
} from '../../state/documents-dashboard.model';
import {toSignal} from '@angular/core/rxjs-interop';
import {Observable} from 'rxjs';
import {progressStatuses} from '../../../core/enums';
import {AuthState} from '../../../auth/state/auth.state';
import {AuthStateModel, User, UserRole} from '../../../auth/state/auth.model';

@Component({
  selector: 'app-documents-dashboard-root',
  templateUrl: './documents-dashboard-root.component.html',
  styleUrl: './documents-dashboard-root.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentsDashboardRootComponent implements OnInit {
  pageIndex = signal(0);
  pageSize = signal(10);
  sortField = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc' | ''>('');
  statusFilter = signal<DocumentStatus | null>(null);
  creatorFilter = signal<User | null>(null);
  filteredDocuments = computed(() => {
    return this.documentsList().filter(doc =>
      (!this.statusFilter() || doc.status === this.statusFilter()) &&
      (!this.creatorFilter() || doc.creator.id === this.creatorFilter()?.id)
    );
  });
  protected readonly progressStatuses = progressStatuses;
  protected readonly userRole = UserRole;
  protected readonly documentStatus = DocumentStatus;
  protected readonly documentStatusRelatedNames = documentStatusRelatedNames;
  private store = new Store();
  readonly user$: Observable<AuthStateModel['user']> = this.store.select(AuthState.user);
  readonly loadDocumentsListStatus$: Observable<DocumentStateModel['loadDocumentsListStatus']> = this.store.select(DocumentsDashboardState.loadDocumentsListStatus);
  documentsList: Signal<DocumentModel[]> = toSignal(
    this.store.select(DocumentsDashboardState.documentsList),
    {initialValue: []}
  );

  ngOnInit() {
    this.fetchDocuments();
  }

  fetchDocuments() {
    this.store.dispatch(new LoadDocumentsList({
      page: this.pageIndex() + 1,
      size: this.pageSize(),
      sort: this.sortField() ? `${this.sortField()},${this.sortDirection()}` : undefined,
      status: this.statusFilter() || undefined,
      creator: this.creatorFilter() || undefined
    }));
  }

  onFiltersChanged(filters: DocumentsListFilters) {
    this.pageIndex.set(filters.page);
    this.pageSize.set(filters.size);
    this.sortField.set(filters.sort?.split(',')[0] || null);
    this.sortDirection.set(filters.sort?.split(',')[1] as 'asc' | 'desc' || '');
    this.statusFilter.set(filters.status || null);
    this.creatorFilter.set(filters.creator || null);
    this.fetchDocuments();
  }
}

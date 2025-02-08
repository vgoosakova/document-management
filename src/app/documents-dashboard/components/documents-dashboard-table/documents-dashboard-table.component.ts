import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal
} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {Sort} from '@angular/material/sort';
import {
  DocumentModel,
  DocumentsListFilters,
  DocumentStateModel,
  DocumentStatus,
  documentStatusRelatedName
} from '../../state/documents-dashboard.model';
import {filter, Observable} from 'rxjs';
import {DocumentsDashboardState} from '../../state/documents-dashboard.state';
import {Store} from '@ngxs/store';
import {ActivatedRoute} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatDialog} from '@angular/material/dialog';
import {
  DocumentsDashboardEditDialogComponent
} from '../documents-dashboard-edit-dialog/documents-dashboard-edit-dialog.component';
import {
  ChangeDocumentStatus,
  DeleteDocument,
  RevokeDocumentReview,
  SendDocumentToReview,
  UpdateDocument
} from '../../state/documents-dashboard.actions';
import {ConfirmDialogComponent} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import {routerLinks} from '../../../core/enums';
import {PAGINATION_PAGE_DEFAULT_SIZE} from '../../../core/core.symbols';

@Component({
  selector: 'app-documents-dashboard-table',
  templateUrl: './documents-dashboard-table.component.html',
  styleUrl: './documents-dashboard-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentsDashboardTableComponent implements OnInit {
  @Input({required: true}) documents!: DocumentModel[];
  @Input() isReviewer!: boolean;
  @Output() filtersChanged = new EventEmitter<DocumentsListFilters>();

  displayedColumns!: string[];
  pageSizeOptions = [5, 10, 25];

  pageIndex = signal(0);
  pageSize = signal(PAGINATION_PAGE_DEFAULT_SIZE);
  sortField = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc' | ''>('');

  protected readonly documentStatus = DocumentStatus;
  protected readonly routerLinks = routerLinks;

  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);

  documentsItemsCount$: Observable<DocumentStateModel['documentsItemsCount']> = this.store.select(DocumentsDashboardState.documentsItemsCount);

  constructor(private readonly activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.displayedColumns = this.isReviewer
      ? ['name', 'status', 'creator', 'updatedAt', 'actions']
      : ['name', 'status', 'updatedAt', 'actions'];

    this.activatedRoute.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const page = Number(params['page']);
      this.pageIndex.set(isNaN(page) || page < 1 ? 0 : page - 1);

      const size = Number(params['size']);
      this.pageSize.set(isNaN(size) ? PAGINATION_PAGE_DEFAULT_SIZE : size);
    });
  }

  revokeDocument(document: DocumentModel): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Revoke Document Review',
        message: `Are you sure you want to revoke "${document.name}"?`,
        confirmText: 'Confirm',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().pipe(filter(Boolean)).subscribe(() => {
      this.store.dispatch(new RevokeDocumentReview(document.id));
    });
  }

  sendDocumentToReview(document: DocumentModel): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Send Document to Review',
        message: `Are you sure you want to send document "${document.name}" to review?`,
        confirmText: 'Confirm',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().pipe(filter(Boolean)).subscribe(() => {
      this.store.dispatch(new SendDocumentToReview(document.id));
    });
  }

  deleteDocument(document: DocumentModel): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Document',
        message: `Are you sure you want to delete "${document.name}"?`,
        confirmText: 'Confirm',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().pipe(filter(Boolean)).subscribe(() => {
      this.store.dispatch(new DeleteDocument(document.id));
    });
  }

  editDocument(document: DocumentModel) {
    const dialogRef = this.dialog.open(DocumentsDashboardEditDialogComponent, {
      width: '400px',
      data: {
        id: document.id,
        name: document.name,
        status: document.status,
        isReviewer: this.isReviewer,
      },
    });

    dialogRef.afterClosed().pipe(filter(Boolean)).subscribe(result => {
      if (this.isReviewer) {
        this.store.dispatch(new ChangeDocumentStatus(document.id, result.status));
      } else {
        this.store.dispatch(new UpdateDocument(document.id, result.name));
      }
    });
  }

  updateFilters() {
    this.filtersChanged.emit({
      page: this.pageIndex(),
      size: this.pageSize(),
      sort: this.sortField() ? `${this.sortField()},${this.sortDirection()}` : undefined
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    this.updateFilters();
  }

  onSortChange(sort: Sort) {
    this.sortField.set(sort.active);
    this.sortDirection.set(sort.direction || '');
    this.updateFilters();
  }

  getStatusLabel(status: DocumentStatus): string {
    return documentStatusRelatedName[status];
  }
}

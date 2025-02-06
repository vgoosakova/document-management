import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, signal, Signal} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {Sort} from '@angular/material/sort';
import {
  DocumentModel,
  DocumentsListFilters,
  DocumentStatus,
  documentStatusRelatedNames,
} from '../../state/documents-dashboard.model';
import {User} from '../../../auth/state/auth.model';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-documents-dashboard-table',
  templateUrl: './documents-dashboard-table.component.html',
  styleUrl: './documents-dashboard-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentsDashboardTableComponent {
  @Input({required: true}) documents!: Signal<DocumentModel[]>;
  @Input() isReviewer!: boolean;

  displayedColumns = ['name', 'status', 'updatedAt', 'actions'];

  @Output() filtersChanged = new EventEmitter<DocumentsListFilters>();

  pageSizeOptions = [5, 10, 25];
  pageIndex = signal(0);
  pageSize = signal(10);
  sortField = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc' | ''>('');
  statusFilter = signal<DocumentStatus | null>(null);
  creatorFilter = signal<User | null>(null);
  protected readonly documentStatus = DocumentStatus;
  private dialog = inject(MatDialog);

  editDocument(document: DocumentModel) {
    // this.dialog.open(DocumentEditDialogComponent, {
    //   width: '400px',
    //   data: document.name
    // });
  }

  updateFilters() {
    this.filtersChanged.emit({
      page: this.pageIndex(),
      size: this.pageSize(),
      sort: this.sortField() ? `${this.sortField()},${this.sortDirection()}` : undefined,
      status: this.statusFilter() || undefined,
      creator: this.creatorFilter() || undefined
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.updateFilters();
  }

  onSortChange(sort: Sort) {
    this.sortField.set(sort.active);
    this.sortDirection.set(sort.direction || '');
    this.updateFilters();
  }

  getStatusLabel(status: DocumentStatus): string {
    return documentStatusRelatedNames[status];
  }
}

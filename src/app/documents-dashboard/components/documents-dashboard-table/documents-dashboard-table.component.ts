import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  Signal
} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {Sort} from '@angular/material/sort';
import {
  DocumentModel,
  DocumentsListFilters,
  DocumentStateModel,
  DocumentStatus,
  documentStatusRelatedName,
} from '../../state/documents-dashboard.model';
import {MatDialog} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {DocumentsDashboardState} from '../../state/documents-dashboard.state';
import {Store} from '@ngxs/store';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-documents-dashboard-table',
  templateUrl: './documents-dashboard-table.component.html',
  styleUrl: './documents-dashboard-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentsDashboardTableComponent implements OnInit {
  @Input({required: true}) documents!: Signal<DocumentModel[]>;
  @Input() isReviewer!: boolean;

  displayedColumns = ['name', 'status', 'updatedAt', 'actions'];

  @Output() filtersChanged = new EventEmitter<DocumentsListFilters>();

  pageSizeOptions = [1, 5, 10, 25];
  pageIndex = signal(0);
  pageSize = signal(10);
  sortField = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc' | ''>('');
  protected readonly documentStatus = DocumentStatus;
  private readonly store = new Store();
  readonly documentsItemsCount$: Observable<DocumentStateModel['documentsItemsCount']> = this.store.select(DocumentsDashboardState.documentsItemsCount);

  constructor(
    private readonly activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const page = Number(params['page']);
      this.pageIndex.set(isNaN(page) || page < 1 ? 0 : page - 1);

      const size = Number(params['size']);
      this.pageSize.set(isNaN(size) ? 10 : size);
    });
  }


  editDocument(document: DocumentModel) {
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

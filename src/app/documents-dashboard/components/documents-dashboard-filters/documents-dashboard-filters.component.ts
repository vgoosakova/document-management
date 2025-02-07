import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {AuthStateModel, UserRole} from '../../../auth/state/auth.model';
import {DocumentsListFilters, DocumentStatus, documentStatusRelatedName} from '../../state/documents-dashboard.model';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {AuthState} from '../../../auth/state/auth.state';
import {ActivatedRoute} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-documents-dashboard-filters',
  templateUrl: './documents-dashboard-filters.component.html',
  styleUrls: ['./documents-dashboard-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentsDashboardFiltersComponent implements OnInit {
  @Input() isReviewer!: boolean;
  store = inject(Store);
  readonly user$: Observable<AuthStateModel['user']> = this.store.select(AuthState.user);
  filters: Partial<DocumentsListFilters> = {
    status: undefined,
    creator: undefined,
    page: 1
  };
  @Output() filtersChanged = new EventEmitter<Partial<DocumentsListFilters>>();
  protected readonly userRole = UserRole;
  protected readonly documentStatus = DocumentStatus;
  protected readonly documentStatusRelatedName = documentStatusRelatedName;
  private readonly destroyRef = inject(DestroyRef);

  constructor(private readonly activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.filters.status = params['status'] || null;
      this.filters.creator = params['creator'] || undefined;
    });
  }

  onFiltersChanged() {
    this.filtersChanged.emit(this.filters);
  }

  clearCreator() {
    this.filters.creator = undefined;
    this.onFiltersChanged();
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {Store} from '@ngxs/store';
import {ActivatedRoute} from '@angular/router';
import {DocumentsDashboardState} from '../../state/documents-dashboard.state';
import {LoadDocument, ResetDocumentDetails} from '../../state/documents-dashboard.actions';
import PSPDFKit, {Instance} from 'pspdfkit';
import {DocumentStateModel} from '../../state/documents-dashboard.model';
import {filter, Observable} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {progressStatuses, routerLinks} from '../../../core/enums';
import {ErrorHandlerService} from '../../../shared/error-handler.service';


@Component({
  selector: 'app-documents-dashboard-document',
  templateUrl: './documents-dashboard-document.component.html',
  styleUrl: './documents-dashboard-document.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentsDashboardDocumentComponent implements OnInit, OnDestroy {
  @ViewChild('viewerContainer', {static: false}) viewerContainer!: ElementRef;
  protected readonly progressStatuses = progressStatuses;
  protected readonly routerLinks = routerLinks;
  private readonly store = inject(Store);
  private errorHandler = inject(ErrorHandlerService);
  readonly manageDocumentStatus$: Observable<DocumentStateModel['manageDocumentStatus']> = this.store.select(DocumentsDashboardState.manageDocumentStatus);
  readonly currentDocument$: Observable<DocumentStateModel['currentDocument']> = this.store.select(DocumentsDashboardState.currentDocument);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private instance: Instance | null = null;

  ngOnInit() {
    const documentId = this.route.snapshot.paramMap.get('id');
    if (documentId) {
      this.store.dispatch(new LoadDocument(documentId));
    }

    this.currentDocument$.pipe(
      filter(value => !!value),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(document => {
      const fileUrl = document.fileUrl
      if (fileUrl && this.viewerContainer) {
        this.loadPSPDFKit(fileUrl);
      }
    })
  }

  ngOnDestroy(): void {
    if (this.instance) {
      PSPDFKit.unload(this.instance);
      this.instance = null;
    }
    this.store.dispatch(new ResetDocumentDetails())
  }

  private async loadPSPDFKit(fileUrl: string) {
    try {
      this.instance = await PSPDFKit.load({
        locale: 'en',
        container: this.viewerContainer.nativeElement,
        document: `${location.protocol}//${location.host}/s3/${fileUrl.split('com/')[1]}`,
        baseUrl: `${location.protocol}//${location.host}/assets/`,
      });
    } catch (error) {
      this.errorHandler.showErrorMessage('Something went wrong...');
      console.error(error);
    }
  }
}

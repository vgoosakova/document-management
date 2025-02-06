import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {defaultDocumentState, DocumentStateModel} from './documents-dashboard.model';
import {DocumentsDashboardService} from '../services/documents-dashboard.service';
import {ErrorHandlerService} from '../../shared/error-handler.service';
import {
  CreateDocument,
  CreateDocumentFail,
  CreateDocumentSuccess,
  LoadDocument,
  LoadDocumentFail,
  LoadDocumentsList,
  LoadDocumentsListFail,
  LoadDocumentsListSuccess,
  LoadDocumentSuccess,
  UpdateDocument,
  UpdateDocumentFail,
  UpdateDocumentSuccess
} from './documents-dashboard.actions';
import {progressStatuses} from '../../core/enums';

@State<DocumentStateModel>({
  name: 'documents',
  defaults: defaultDocumentState,
})
@Injectable()
export class DocumentsDashboardState {
  constructor(private documentsDashboardService: DocumentsDashboardService, private errorHandler: ErrorHandlerService) {
  }

  @Selector()
  static loadDocumentsListStatus(state: DocumentStateModel): DocumentStateModel['loadDocumentsListStatus'] {
    return state.loadDocumentsListStatus;
  }

  @Selector()
  static documentsList(state: DocumentStateModel): DocumentStateModel['documentsList'] {
    return state.documentsList;
  }

  @Selector()
  static manageDocumentStatus(state: DocumentStateModel): DocumentStateModel['manageDocumentStatus'] {
    return state.manageDocumentStatus;
  }

  @Selector()
  static currentDocument(state: DocumentStateModel): DocumentStateModel['currentDocument'] {
    return state.currentDocument;
  }

  @Selector()
  static performDocumentActionStatus(state: DocumentStateModel): DocumentStateModel['performDocumentActionStatus'] {
    return state.performDocumentActionStatus;
  }


  @Action(LoadDocumentsList)
  loadDocumentsList(ctx: StateContext<DocumentStateModel>, {filters}: LoadDocumentsList): void {
    ctx.patchState({
      loadDocumentsListStatus: progressStatuses.inProgress,
      lastLoadDocumentsListError: null,
    });

    this.documentsDashboardService.loadDocumentsList(filters).subscribe({
      next: documentsList => ctx.dispatch(new LoadDocumentsListSuccess(documentsList)),
      error: err => ctx.dispatch(new LoadDocumentsListFail(err)),
    });
  }

  @Action(LoadDocumentsListSuccess)
  loadDocumentsListSuccess(ctx: StateContext<DocumentStateModel>, {payload}: LoadDocumentsListSuccess): void {
    ctx.patchState({
      loadDocumentsListStatus: progressStatuses.succeed,
      documentsList: payload.results,
      documentsItemsCount: payload.count,
    });
  }

  @Action(LoadDocumentsListFail)
  loadDocumentsListFail(ctx: StateContext<DocumentStateModel>, {error}: LoadDocumentsListFail): void {
    ctx.patchState({
      loadDocumentsListStatus: progressStatuses.interrupted,
      lastLoadDocumentsListError: error,
    });

    this.errorHandler.showError(error.error.message);
  }

  @Action(CreateDocument)
  createDocument(ctx: StateContext<DocumentStateModel>, {documentData}: CreateDocument): void {
    ctx.patchState({
      manageDocumentStatus: progressStatuses.inProgress,
      lastManageDocumentError: null,
    });

    this.documentsDashboardService.createDocument(documentData).subscribe({
      next: document => ctx.dispatch(new CreateDocumentSuccess(document)),
      error: error => ctx.dispatch(new CreateDocumentFail(error)),
    });
  }

  @Action(CreateDocumentSuccess)
  createDocumentSuccess(ctx: StateContext<DocumentStateModel>, {currentDocument}: CreateDocumentSuccess): void {
    ctx.patchState({
      manageDocumentStatus: progressStatuses.succeed,
    });
  }

  @Action(CreateDocumentFail)
  createDocumentFail(ctx: StateContext<DocumentStateModel>, {error}: CreateDocumentFail): void {
    ctx.patchState({
      manageDocumentStatus: progressStatuses.interrupted,
      lastManageDocumentError: error,
    });

    this.errorHandler.showError(error.error.message);
  }

  @Action(LoadDocument)
  loadDocument(ctx: StateContext<DocumentStateModel>, {documentId}: LoadDocument): void {
    ctx.patchState({
      manageDocumentStatus: progressStatuses.inProgress,
      lastManageDocumentError: null,
    });

    this.documentsDashboardService.loadDocument(documentId).subscribe({
      next: document => ctx.dispatch(new LoadDocumentSuccess(document)),
      error: err => ctx.dispatch(new LoadDocumentFail(err)),
    });
  }

  @Action(LoadDocumentSuccess)
  loadDocumentSuccess(ctx: StateContext<DocumentStateModel>, {currentDocument}: LoadDocumentSuccess): void {
    ctx.patchState({
      manageDocumentStatus: progressStatuses.succeed,
      currentDocument,
    });
  }

  @Action(LoadDocumentFail)
  loadDocumentFail(ctx: StateContext<DocumentStateModel>, {error}: LoadDocumentFail): void {
    ctx.patchState({
      manageDocumentStatus: progressStatuses.interrupted,
      lastManageDocumentError: error,
    });

    this.errorHandler.showError(error.error.message);
  }

  @Action(UpdateDocument)
  updateDocument(ctx: StateContext<DocumentStateModel>, {
    documentId,
    updatedDocument,
  }: UpdateDocument): void {
    ctx.patchState({
      manageDocumentStatus: progressStatuses.inProgress,
      lastManageDocumentError: null,
    });

    this.documentsDashboardService.updateDocument(documentId, updatedDocument).subscribe({
      next: document => ctx.dispatch(new UpdateDocumentSuccess(document)),
      error: err => ctx.dispatch(new UpdateDocumentFail(err)),
    });
  }

  @Action(UpdateDocumentSuccess)
  updateDocumentSuccess(ctx: StateContext<DocumentStateModel>, {updatedDocument}: UpdateDocumentSuccess): void {
    ctx.patchState({
      manageDocumentStatus: progressStatuses.succeed,
    });
  }

  @Action(UpdateDocumentFail)
  updateDocumentFail(ctx: StateContext<DocumentStateModel>, {error}: UpdateDocumentFail): void {
    ctx.patchState({
      manageDocumentStatus: progressStatuses.interrupted,
      lastManageDocumentError: error,
    });

    this.errorHandler.showError(error.error.message);
  }
}

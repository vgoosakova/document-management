import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {defaultDocumentState, DocumentStateModel, DocumentStatus} from './documents-dashboard.model';
import {DocumentsDashboardService} from '../services/documents-dashboard.service';
import {ErrorHandlerService} from '../../shared/error-handler.service';
import {
  ChangeDocumentStatus,
  ChangeDocumentStatusFail,
  ChangeDocumentStatusSuccess,
  CreateDocument,
  CreateDocumentFail,
  CreateDocumentSuccess,
  DeleteDocument,
  DeleteDocumentFail,
  DeleteDocumentSuccess,
  LoadDocument,
  LoadDocumentFail,
  LoadDocumentsList,
  LoadDocumentsListFail,
  LoadDocumentsListSuccess,
  LoadDocumentSuccess,
  ResetDocumentDetails,
  RevokeDocumentReview,
  RevokeDocumentReviewFail,
  RevokeDocumentReviewSuccess,
  SendDocumentToReview,
  SendDocumentToReviewFail,
  SendDocumentToReviewSuccess,
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
  static documentsItemsCount(state: DocumentStateModel): DocumentStateModel['documentsItemsCount'] {
    return state.documentsItemsCount;
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
    const state = ctx.getState();
    const updatedList = [currentDocument, ...state.documentsList]
    ctx.patchState({
      manageDocumentStatus: progressStatuses.succeed,
      documentsList: updatedList
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
    name,
  }: UpdateDocument): void {
    ctx.patchState({
      manageDocumentStatus: progressStatuses.inProgress,
      lastManageDocumentError: null,
    });

    this.documentsDashboardService.updateDocument(documentId, name).subscribe({
      next: () => ctx.dispatch(new UpdateDocumentSuccess(documentId, name)),
      error: err => ctx.dispatch(new UpdateDocumentFail(err)),
    });
  }

  @Action(UpdateDocumentSuccess)
  updateDocumentSuccess(ctx: StateContext<DocumentStateModel>, {documentId, name}: UpdateDocumentSuccess): void {
    const state = ctx.getState();
    const updatedList = state.documentsList.map(doc =>
      doc.id === documentId ? {...doc, name} : doc
    );

    ctx.patchState({
      manageDocumentStatus: progressStatuses.succeed,
      documentsList: updatedList,
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

  @Action(DeleteDocument)
  deleteDocument(ctx: StateContext<DocumentStateModel>, {documentId}: DeleteDocument): void {
    ctx.patchState({
      performDocumentActionStatus: progressStatuses.inProgress,
      lastPerformDocumentActionError: null,
    });

    this.documentsDashboardService.deleteDocument(documentId).subscribe({
      next: () => ctx.dispatch(new DeleteDocumentSuccess(documentId)),
      error: err => ctx.dispatch(new DeleteDocumentFail(err)),
    });
  }

  @Action(DeleteDocumentSuccess)
  deleteDocumentSuccess(ctx: StateContext<DocumentStateModel>, {documentId}: DeleteDocumentSuccess): void {
    const state = ctx.getState();
    const updatedList = state.documentsList.filter(doc => doc.id !== documentId);

    ctx.patchState({
      performDocumentActionStatus: progressStatuses.succeed,
      documentsList: updatedList,
      documentsItemsCount: state.documentsItemsCount - 1,
    });
  }

  @Action(DeleteDocumentFail)
  deleteDocumentFail(ctx: StateContext<DocumentStateModel>, {error}: DeleteDocumentFail): void {
    ctx.patchState({
      performDocumentActionStatus: progressStatuses.interrupted,
      lastPerformDocumentActionError: error,
    });

    this.errorHandler.showError(error.error.message);
  }

  @Action(ChangeDocumentStatus)
  changeDocumentStatus(ctx: StateContext<DocumentStateModel>, {
    documentId,
    status,
  }: ChangeDocumentStatus): void {
    ctx.patchState({
      performDocumentActionStatus: progressStatuses.inProgress,
      lastPerformDocumentActionError: null,
    });

    this.documentsDashboardService.changeDocumentStatus(documentId, status).subscribe({
      next: () => ctx.dispatch(new ChangeDocumentStatusSuccess(documentId, status)),
      error: err => ctx.dispatch(new ChangeDocumentStatusFail(err)),
    });
  }

  @Action(ChangeDocumentStatusSuccess)
  changeDocumentStatusSuccess(ctx: StateContext<DocumentStateModel>, {
    documentId,
    status
  }: ChangeDocumentStatusSuccess): void {
    const state = ctx.getState();
    const updatedList = state.documentsList.map(doc =>
      doc.id === documentId ? {...doc, status} : doc
    );

    ctx.patchState({
      performDocumentActionStatus: progressStatuses.succeed,
      documentsList: updatedList,
    });
  }

  @Action(ChangeDocumentStatusFail)
  changeDocumentStatusFail(ctx: StateContext<DocumentStateModel>, {error}: ChangeDocumentStatusFail): void {
    ctx.patchState({
      performDocumentActionStatus: progressStatuses.interrupted,
      lastPerformDocumentActionError: error,
    });

    this.errorHandler.showError(error.error.message);
  }

  @Action(RevokeDocumentReview)
  revokeDocumentReview(ctx: StateContext<DocumentStateModel>, {documentId,}: RevokeDocumentReview): void {
    ctx.patchState({
      performDocumentActionStatus: progressStatuses.inProgress,
      lastPerformDocumentActionError: null,
    });

    this.documentsDashboardService.revokeDocumentReview(documentId).subscribe({
      next: () => ctx.dispatch(new RevokeDocumentReviewSuccess(documentId)),
      error: err => ctx.dispatch(new RevokeDocumentReviewFail(err)),
    });
  }

  @Action(RevokeDocumentReviewSuccess)
  revokeDocumentReviewSuccess(ctx: StateContext<DocumentStateModel>, {documentId}: RevokeDocumentReviewSuccess): void {
    const state = ctx.getState();
    const updatedList = state.documentsList.map(doc =>
      doc.id === documentId ? {...doc, status: DocumentStatus.revoke} : doc
    );

    ctx.patchState({
      performDocumentActionStatus: progressStatuses.succeed,
      documentsList: updatedList,
    });
  }

  @Action(RevokeDocumentReviewFail)
  revokeDocumentReviewFail(ctx: StateContext<DocumentStateModel>, {error}: ChangeDocumentStatusFail): void {
    ctx.patchState({
      performDocumentActionStatus: progressStatuses.interrupted,
      lastPerformDocumentActionError: error,
    });

    this.errorHandler.showError(error.error.message);
  }

  @Action(SendDocumentToReview)
  sendDocumentToReview(ctx: StateContext<DocumentStateModel>, {documentId,}: SendDocumentToReview): void {
    ctx.patchState({
      performDocumentActionStatus: progressStatuses.inProgress,
      lastPerformDocumentActionError: null,
    });

    this.documentsDashboardService.sendDocumentToReview(documentId).subscribe({
      next: () => ctx.dispatch(new SendDocumentToReviewSuccess(documentId)),
      error: err => ctx.dispatch(new SendDocumentToReviewFail(err)),
    });
  }

  @Action(SendDocumentToReviewSuccess)
  sendDocumentToReviewSuccess(ctx: StateContext<DocumentStateModel>, {documentId}: SendDocumentToReviewSuccess): void {
    const state = ctx.getState();
    const updatedList = state.documentsList.map(doc =>
      doc.id === documentId ? {...doc, status: DocumentStatus.readyForReview} : doc
    );

    ctx.patchState({
      performDocumentActionStatus: progressStatuses.succeed,
      documentsList: updatedList,
    });
  }

  @Action(SendDocumentToReviewFail)
  sendDocumentToReviewFail(ctx: StateContext<DocumentStateModel>, {error}: ChangeDocumentStatusFail): void {
    ctx.patchState({
      performDocumentActionStatus: progressStatuses.interrupted,
      lastPerformDocumentActionError: error,
    });

    this.errorHandler.showError(error.error.message);
  }

  @Action(ResetDocumentDetails)
  resetDocumentDetails(ctx: StateContext<DocumentStateModel>): void {
    ctx.patchState({
      currentDocument: null
    });
  }
}

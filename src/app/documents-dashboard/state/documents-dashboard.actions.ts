import {DocumentModel, DocumentCreateModel, DocumentsListFilters} from './documents-dashboard.model';
import {HttpErrorResponse} from '@angular/common/http';
import {BackendPagination} from '../../core/core.symbols';

/** Unique identifier of the related state. */
const uniqueStateIdentifier = '[DocumentsDashboard]';

export class LoadDocumentsList {
  static readonly type = `${uniqueStateIdentifier} ${LoadDocumentsList.name}`;

  constructor(public filters: DocumentsListFilters) {
  }
}

export class LoadDocumentsListSuccess {
  static readonly type = `${uniqueStateIdentifier} ${LoadDocumentsListSuccess.name}`;

  constructor(public payload: BackendPagination<DocumentModel[]>) {
  }
}

export class LoadDocumentsListFail {
  static readonly type = `${uniqueStateIdentifier} ${LoadDocumentsListFail.name}`;

  constructor(public error: HttpErrorResponse) {
  }
}

export class CreateDocument {
  static readonly type = `${uniqueStateIdentifier} ${CreateDocument.name}`;

  constructor(public documentData: DocumentCreateModel) {
  }
}

export class CreateDocumentSuccess {
  static readonly type = `${uniqueStateIdentifier} ${CreateDocumentSuccess.name}`;

  constructor(public currentDocument: DocumentModel) {
  }
}

export class CreateDocumentFail {
  static readonly type = `${uniqueStateIdentifier} ${CreateDocumentFail.name}`;

  constructor(public error: HttpErrorResponse) {
  }
}

export class LoadDocument {
  static readonly type = `${uniqueStateIdentifier} ${LoadDocument.name}`;

  constructor(public documentId: DocumentModel['id']) {
  }
}

export class LoadDocumentSuccess {
  static readonly type = `${uniqueStateIdentifier} ${LoadDocumentSuccess.name}`;

  constructor(public currentDocument: DocumentModel) {
  }
}

export class LoadDocumentFail {
  static readonly type = `${uniqueStateIdentifier} ${LoadDocumentFail.name}`;

  constructor(public error: HttpErrorResponse) {
  }
}

export class UpdateDocument {
  static readonly type = `${uniqueStateIdentifier} ${UpdateDocument.name}`;

  constructor(public documentId: DocumentModel['id'], public updatedDocument: DocumentModel['name']) {
  }
}

export class UpdateDocumentSuccess {
  static readonly type = `${uniqueStateIdentifier} ${UpdateDocumentSuccess.name}`;

  constructor(public updatedDocument: DocumentModel) {
  }
}

export class UpdateDocumentFail {
  static readonly type = `${uniqueStateIdentifier} ${UpdateDocumentFail.name}`;

  constructor(public error: HttpErrorResponse) {
  }
}

export class DeleteDocument {
  static readonly type = `${uniqueStateIdentifier} ${DeleteDocument.name}`;

  constructor(public documentId: DocumentModel['id']) {
  }
}

export class DeleteDocumentSuccess {
  static readonly type = `${uniqueStateIdentifier} ${DeleteDocumentSuccess.name}`;

  constructor(public documentId: DocumentModel['id']) {
  }
}

export class DeleteDocumentFail {
  static readonly type = `${uniqueStateIdentifier} ${DeleteDocumentFail.name}`;

  constructor(public error: HttpErrorResponse) {
  }
}

export class SendDocumentToReview {
  static readonly type = `${uniqueStateIdentifier} ${SendDocumentToReview.name}`;

  constructor(public documentId: DocumentModel['id']) {
  }
}

export class SendDocumentToReviewSuccess {
  static readonly type = `${uniqueStateIdentifier} ${SendDocumentToReviewSuccess.name}`;

  constructor(public documentId: DocumentModel['id']) {
  }
}

export class SendDocumentToReviewFail {
  static readonly type = `${uniqueStateIdentifier} ${SendDocumentToReviewFail.name}`;

  constructor(public error: HttpErrorResponse) {
  }
}

export class RevokeDocumentReview {
  static readonly type = `${uniqueStateIdentifier} ${RevokeDocumentReview.name}`;

  constructor(public documentId: DocumentModel['id']) {
  }
}

export class RevokeDocumentReviewSuccess {
  static readonly type = `${uniqueStateIdentifier} ${RevokeDocumentReviewSuccess.name}`;

  constructor(public documentId: DocumentModel['id']) {
  }
}

export class RevokeDocumentReviewFail {
  static readonly type = `${uniqueStateIdentifier} ${RevokeDocumentReviewFail.name}`;

  constructor(public error: HttpErrorResponse) {
  }
}

export class ChangeDocumentStatus {
  static readonly type = `${uniqueStateIdentifier} ${ChangeDocumentStatus.name}`;

  constructor(public documentId: DocumentModel['id']) {
  }
}

export class ChangeDocumentStatusSuccess {
  static readonly type = `${uniqueStateIdentifier} ${ChangeDocumentStatusSuccess.name}`;

  constructor(public documentId: DocumentModel['id']) {
  }
}

export class ChangeDocumentStatusFail {
  static readonly type = `${uniqueStateIdentifier} ${ChangeDocumentStatusFail.name}`;

  constructor(public error: HttpErrorResponse) {
  }
}

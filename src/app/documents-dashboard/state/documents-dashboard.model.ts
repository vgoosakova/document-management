import {User} from '../../auth/state/auth.model';
import {HttpErrorResponse} from '@angular/common/http';
import {progressStatuses} from '../../core/enums';

/** Describes a document state model. */
export interface DocumentStateModel {
  /** Contain current process status of a loading documents list process. */
  loadDocumentsListStatus: progressStatuses;

  /** Contain the last error that occurs during the loading documents list process. */
  lastLoadDocumentsListError: HttpErrorResponse | null;

  /** Contain a loaded documents list. */
  documentsList: DocumentModel[];

  /** Contain number of all items loaded. */
  documentsItemsCount: number;

  /** Contain current process status of a managing document process (create, load, update, delete). */
  manageDocumentStatus: progressStatuses;

  /** Contain the last error that occurs during the managing document process (create, load, update, delete). */
  lastManageDocumentError: HttpErrorResponse | null;

  /** Contain a loaded document. */
  currentDocument: DocumentModel | null;

  /** Contain current process status of the performing document action (send, revoke, change). */
  performDocumentActionStatus: progressStatuses;

  /** Contain the last error that occurs during the performing document action (send, revoke, change). */
  lastPerformDocumentActionError: HttpErrorResponse | null;
}

/** Default data for document state initialization & reset. */
export const defaultDocumentState: DocumentStateModel = {
  loadDocumentsListStatus: progressStatuses.notInitialized,
  lastLoadDocumentsListError: null,
  documentsList: [],
  documentsItemsCount: 0,

  manageDocumentStatus: progressStatuses.notInitialized,
  lastManageDocumentError: null,
  currentDocument: null,

  performDocumentActionStatus: progressStatuses.notInitialized,
  lastPerformDocumentActionError: null,
};

export interface DocumentsListFilters {
  page: number;
  size: number;
  sort?: string;
  status?: DocumentStatus;
  creator?: string;
}

export interface DocumentModel {
  creator: User;
  id: string;
  name: number;
  status: string;
  fileUrl: string;
  updatedAt: string;
  createdAt: string;
}

export interface DocumentCreateModel {
  name: string;
  file: string;
  status: string;
}

export enum DocumentStatus {
  draft = 'DRAFT',
  revoke = 'REVOKE',
  readyForReview = 'READY_FOR_REVIEW',
  underReview = 'UNDER_REVIEW',
  approved = 'APPROVED',
  declined = 'DECLINED'
}

export const documentStatusRelatedName: { [key in DocumentStatus]: string } = {
  [DocumentStatus.draft]: 'Draft',
  [DocumentStatus.revoke]: 'Revoke',
  [DocumentStatus.readyForReview]: 'Ready for review',
  [DocumentStatus.underReview]: 'Under Review',
  [DocumentStatus.approved]: 'Approved',
  [DocumentStatus.declined]: 'Decline',
};

import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DocumentModel, DocumentsListFilters} from '../state/documents-dashboard.model';
import {BackendPagination} from '../../core/core.symbols';

@Injectable()
export class DocumentsDashboardService {
  API_ENDPOINT = '/api/v1/document';

  http = inject(HttpClient)

  public loadDocumentsList(filters: DocumentsListFilters): Observable<BackendPagination<DocumentModel[]>> {
    const params: any = {page: filters.page, size: filters.size};

    if (filters.sort) {
      params.sort = filters.sort;
    }

    if (filters.status) {
      params.status = filters.status;
    }

    if (filters.creator) {
      params.creator = filters.creator;
    }

    return this.http.get<BackendPagination<DocumentModel[]>>(`${this.API_ENDPOINT}/`, {params});
  }

  public createDocument(documentData: FormData): Observable<DocumentModel> {
    return this.http.post<DocumentModel>(`${this.API_ENDPOINT}/`, documentData);
  }

  public loadDocument(documentId: DocumentModel['id']): Observable<DocumentModel> {
    const url = `${this.API_ENDPOINT}/${documentId}/`;
    return this.http.get<DocumentModel>(url);
  }

  public updateDocument(documentId: DocumentModel['id'], name: DocumentModel['name']): Observable<void> {
    const url = `${this.API_ENDPOINT}/${documentId}/`;
    return this.http.patch<void>(url, {name});
  }

  public deleteDocument(documentId: DocumentModel['id']): Observable<void> {
    const url = `${this.API_ENDPOINT}/${documentId}/`;
    return this.http.delete<void>(url);
  }

  public sendDocumentToReview(documentId: DocumentModel['id']): Observable<void> {
    const url = `${this.API_ENDPOINT}/${documentId}/send-to-review`;
    return this.http.post<void>(url, {});
  }

  public revokeDocumentReview(documentId: DocumentModel['id']): Observable<void> {
    const url = `${this.API_ENDPOINT}/${documentId}/revoke-review`;
    return this.http.post<void>(url, {});
  }

  public changeDocumentStatus(documentId: DocumentModel['id'], status: DocumentModel['status']): Observable<void> {
    const url = `${this.API_ENDPOINT}/${documentId}/change-status`;
    return this.http.post<void>(url, {status});
  }
}

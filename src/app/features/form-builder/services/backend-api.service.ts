import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, shareReplay } from 'rxjs';
import { FormDefinition } from '../models/field';
import { BackendFormExport, FormSubmissionExport } from './form-export.service';
import { API_CONFIG } from '../../../core/config/api.config';

export interface CreateFormDto {
  name: string;
  schemaJson: string;
}

export interface UpdateFormDto {
  id: number;
  name: string;
  schemaJson: string;
}

export interface SubmitFormDto {
  formDefinitionId: number;
  dataJson: string;
}

export interface FormSubmission {
  id: number;
  formDefinitionId: number;
  dataJson: string;
  submittedAt: string;
}

export interface FormListItem {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  fieldCount: number;
  isActive: boolean;
}

export interface FormSchemaItem {
  id: number;
  name: string;
  schemaJson: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class BackendApiService {
  constructor(private http: HttpClient) {}

  private formSchemasCache$?: Observable<FormSchemaItem[]>;
  private formListCache$?: Observable<FormListItem[]>;

  private get FORM_DEFINITIONS() {
    return API_CONFIG.ENDPOINTS.FORM_DEFINITIONS;
  }
  private get FORM_SUBMISSIONS() {
    return API_CONFIG.ENDPOINTS.FORM_SUBMISSIONS;
  }

  // Form Definitions API
  createFormDefinition(formData: CreateFormDto): Observable<any> {
    return this.http
      .post(`${this.FORM_DEFINITIONS}`, formData)
      .pipe(tap(() => this.clearFormDefinitionsCache()));
  }

  exportFormToBackend(exportData: BackendFormExport): Observable<any> {
    return this.http
      .post(`${this.FORM_DEFINITIONS}`, exportData)
      .pipe(tap(() => this.clearFormDefinitionsCache()));
  }

  updateFormDefinition(formData: UpdateFormDto): Observable<any> {
    return this.http
      .put(`${this.FORM_DEFINITIONS}/${formData.id}`, formData)
      .pipe(tap(() => this.clearFormDefinitionsCache()));
  }

  getFormDefinitions(): Observable<any> {
    return this.http.get(`${this.FORM_DEFINITIONS}`);
  }

  getFormList(forceRefresh = false): Observable<FormListItem[]> {
    if (!this.formListCache$ || forceRefresh) {
      this.formListCache$ = this.http
        .get<FormListItem[]>(`${this.FORM_DEFINITIONS}/list`)
        .pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }
    return this.formListCache$;
  }

  getFormSchemas(forceRefresh = false): Observable<FormSchemaItem[]> {
    if (!this.formSchemasCache$ || forceRefresh) {
      this.formSchemasCache$ = this.http
        .get<FormSchemaItem[]>(`${this.FORM_DEFINITIONS}/WithSchema`)
        .pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }
    return this.formSchemasCache$;
  }

  getFormDefinition(id: number): Observable<any> {
    return this.http.get(`${this.FORM_DEFINITIONS}/${id}`);
  }

  deleteFormDefinition(id: number): Observable<any> {
    return this.http
      .delete(`${this.FORM_DEFINITIONS}/${id}`)
      .pipe(tap(() => this.clearFormDefinitionsCache()));
  }

  getFormSubmissions(formId: number): Observable<any> {
    return this.http.get(`${this.FORM_DEFINITIONS}/${formId}/Submissions`);
  }

  // Get form submissions for a specific form definition
  getFormDefinitionSubmissions(
    formDefinitionId: number
  ): Observable<FormSubmission[]> {
    return this.http.get<FormSubmission[]>(
      `${this.FORM_DEFINITIONS}/${formDefinitionId}/Submissions`
    );
  }

  // Form Submissions API
  submitForm(submissionData: SubmitFormDto): Observable<any> {
    return this.http.post(`${this.FORM_SUBMISSIONS}`, submissionData);
  }

  getFormSubmission(id: number): Observable<any> {
    return this.http.get(`${this.FORM_SUBMISSIONS}/${id}`);
  }

  // Tenant API
  getTenants(): Observable<any> {
    return this.http.get(`${API_CONFIG.ENDPOINTS.TENANT}`);
  }

  getTenant(id: number): Observable<any> {
    return this.http.get(`${API_CONFIG.ENDPOINTS.TENANT}/${id}`);
  }

  createTenant(name: string): Observable<any> {
    return this.http.post(`${API_CONFIG.ENDPOINTS.TENANT}`, null, {
      params: { name },
    });
  }

  private clearFormDefinitionsCache(): void {
    this.formSchemasCache$ = undefined;
    this.formListCache$ = undefined;
  }
}

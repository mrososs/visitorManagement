import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import {
  BackendApiService,
  FormListItem,
} from '../../services/backend-api.service';
import { FormDefinition } from '../../models/field';

@Component({
  selector: 'app-form-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="form-list-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Form Definitions</mat-card-title>
          <mat-card-subtitle>
            Manage and edit your form definitions
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <!-- Loading State -->
          <div *ngIf="loading" class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Loading forms...</p>
          </div>

          <!-- Error State -->
          <div *ngIf="error && !loading" class="error-container">
            <mat-icon class="error-icon">error</mat-icon>
            <h3>Error Loading Forms</h3>
            <p>{{ error }}</p>
            <button mat-raised-button color="primary" (click)="loadForms()">
              Retry
            </button>
          </div>

          <!-- Empty State -->
          <div
            *ngIf="!loading && !error && forms.length === 0"
            class="empty-container"
          >
            <mat-icon class="empty-icon">description</mat-icon>
            <h3>No Forms Found</h3>
            <p>Create your first form definition to get started.</p>
            <button mat-raised-button color="primary" (click)="createNewForm()">
              Create New Form
            </button>
          </div>

          <!-- Forms Table -->
          <div
            *ngIf="!loading && !error && forms.length > 0"
            class="table-container"
          >
            <table
              mat-table
              [dataSource]="forms"
              matSort
              (matSortChange)="sortData($event)"
            >
              <!-- ID Column -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
                <td mat-cell *matCellDef="let form">{{ form.id }}</td>
              </ng-container>

              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
                <td mat-cell *matCellDef="let form">
                  <div class="form-name-cell">
                    <span class="form-name">{{ form.name }}</span>
                    <span *ngIf="form.description" class="form-description">
                      {{ form.description }}
                    </span>
                  </div>
                </td>
              </ng-container>

              <!-- Field Count Column -->
              <ng-container matColumnDef="fieldCount">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>
                  Fields
                </th>
                <td mat-cell *matCellDef="let form">
                  <mat-chip-set>
                    <mat-chip color="primary">{{ form.fieldCount }}</mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let form">
                  <mat-chip-set>
                    <mat-chip [color]="form.isActive ? 'accent' : 'warn'">
                      {{ form.isActive ? 'Active' : 'Inactive' }}
                    </mat-chip>
                  </mat-chip-set>
                </td>
              </ng-container>

              <!-- Created Date Column -->
              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>
                  Created
                </th>
                <td mat-cell *matCellDef="let form">
                  {{ form.createdAt | date : 'short' }}
                </td>
              </ng-container>

              <!-- Updated Date Column -->
              <ng-container matColumnDef="updatedAt">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>
                  Updated
                </th>
                <td mat-cell *matCellDef="let form">
                  {{ form.updatedAt | date : 'short' }}
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let form">
                  <div class="actions-container">
                    <button
                      mat-icon-button
                      color="primary"
                      (click)="editForm(form)"
                      matTooltip="Edit Form"
                    >
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button
                      mat-icon-button
                      color="accent"
                      (click)="viewForm(form)"
                      matTooltip="View Form"
                    >
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <button
                      mat-icon-button
                      color="warn"
                      (click)="deleteForm(form)"
                      matTooltip="Delete Form"
                    >
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
            </table>

            <mat-paginator
              [length]="totalForms"
              [pageSize]="pageSize"
              [pageSizeOptions]="[5, 10, 25, 50]"
              [pageIndex]="currentPage"
              (page)="onPageChange($event)"
              showFirstLastButtons
            ></mat-paginator>
          </div>
        </mat-card-content>

        <mat-card-actions *ngIf="!loading && !error">
          <button mat-raised-button color="primary" (click)="createNewForm()">
            <mat-icon>add</mat-icon>
            Create New Form
          </button>
          <button mat-button (click)="refreshForms()">
            <mat-icon>refresh</mat-icon>
            Refresh
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .form-list-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;
        gap: 20px;
      }

      .loading-container p {
        color: #666;
        margin: 0;
      }

      .error-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;
        text-align: center;
        gap: 20px;
      }

      .error-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #f44336;
      }

      .error-container h3 {
        margin: 0;
        color: #333;
      }

      .error-container p {
        margin: 0;
        color: #666;
      }

      .empty-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;
        text-align: center;
        gap: 20px;
      }

      .empty-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #ccc;
      }

      .empty-container h3 {
        margin: 0;
        color: #333;
      }

      .empty-container p {
        margin: 0;
        color: #666;
      }

      .table-container {
        overflow-x: auto;
        max-height: calc(100vh - 300px);
        overflow-y: auto;
      }

      table {
        width: 100%;
      }

      .form-name-cell {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .form-name {
        font-weight: 500;
        color: #333;
      }

      .form-description {
        font-size: 12px;
        color: #666;
        line-height: 1.2;
      }

      .actions-container {
        display: flex;
        gap: 8px;
      }

      .actions-container button {
        width: 32px;
        height: 32px;
        line-height: 32px;
      }

      .actions-container mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      mat-card-actions {
        display: flex;
        gap: 16px;
        padding: 16px;
        border-top: 1px solid #e0e0e0;
      }

      mat-card-actions button {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .form-list-container {
          padding: 10px;
        }

        .table-container {
          max-height: calc(100vh - 250px);
        }

        .actions-container {
          flex-direction: column;
          gap: 4px;
        }

        .actions-container button {
          width: 28px;
          height: 28px;
          line-height: 28px;
        }

        mat-card-actions {
          flex-direction: column;
        }
      }

      /* Custom scrollbar */
      .table-container::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      .table-container::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
      }

      .table-container::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 4px;
      }

      .table-container::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
      }
    `,
  ],
})
export class FormListComponent implements OnInit {
  @Output() formSelected = new EventEmitter<FormListItem>();
  @Output() editFormRequested = new EventEmitter<FormListItem>();

  forms: FormListItem[] = [];
  loading = false;
  error: string | null = null;
  totalForms = 0;
  currentPage = 0;
  pageSize = 10;

  displayedColumns: string[] = [
    'id',
    'name',
    'fieldCount',
    'status',
    'createdAt',
    'updatedAt',
    'actions',
  ];

  private backendApiService = inject(BackendApiService);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.loadForms();
  }

  loadForms() {
    this.loading = true;
    this.error = null;

    this.backendApiService.getFormList().subscribe({
      next: (forms) => {
        this.forms = forms;
        this.totalForms = forms.length;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load forms. Please try again.';
        this.loading = false;
        console.error('Error loading forms:', error);
      },
    });
  }

  refreshForms() {
    this.loadForms();
  }

  createNewForm() {
    // Emit event to create new form
    this.formSelected.emit({
      id: 0,
      name: 'New Form',
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fieldCount: 0,
      isActive: true,
    });
  }

  editForm(form: FormListItem) {
    this.editFormRequested.emit(form);
  }

  viewForm(form: FormListItem) {
    this.formSelected.emit(form);
  }

  deleteForm(form: FormListItem) {
    if (confirm(`Are you sure you want to delete "${form.name}"?`)) {
      // Implement delete functionality
      this.snackBar.open(`Form "${form.name}" deleted successfully`, 'Close', {
        duration: 3000,
      });
      this.loadForms(); // Refresh the list
    }
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    // Implement pagination logic if needed
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }

    this.forms = this.forms.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return this.compare(a.id, b.id, isAsc);
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'fieldCount':
          return this.compare(a.fieldCount, b.fieldCount, isAsc);
        case 'createdAt':
          return this.compare(
            new Date(a.createdAt),
            new Date(b.createdAt),
            isAsc
          );
        case 'updatedAt':
          return this.compare(
            new Date(a.updatedAt),
            new Date(b.updatedAt),
            isAsc
          );
        default:
          return 0;
      }
    });
  }

  private compare(a: any, b: any, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}

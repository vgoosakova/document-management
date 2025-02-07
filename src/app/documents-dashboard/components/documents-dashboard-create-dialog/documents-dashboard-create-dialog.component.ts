import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Store} from '@ngxs/store';
import {CreateDocument} from '../../state/documents-dashboard.actions';

interface DocumentData {
  id: string;
  name: string;
  status: string;
  isReviewer: boolean;
}

@Component({
  selector: 'app-documents-dashboard-create-dialog',
  templateUrl: './documents-dashboard-create-dialog.component.html',
  styleUrl: './documents-dashboard-create-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentsDashboardCreateDialogComponent {
  documentForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store,
    public dialogRef: MatDialogRef<DocumentsDashboardCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.documentForm = this.fb.group({
      name: ['', Validators.required],
      file: [null, Validators.required],
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  submitDocument(status: 'draft' | 'readyForReview'): void {
    if (this.documentForm.invalid || !this.selectedFile) return;

    const formData = new FormData();
    formData.append('name', this.documentForm.value.name);
    formData.append('file', this.selectedFile);
    formData.append('status', status);

    this.store.dispatch(new CreateDocument(formData)).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}

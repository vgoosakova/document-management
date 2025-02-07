import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DocumentStatus, documentStatusRelatedName} from '../../state/documents-dashboard.model';

interface DocumentData {
  id: string;
  name: string;
  status: string;
  isReviewer: boolean;
}

@Component({
  selector: 'app-documents-dashboard-edit-dialog',
  templateUrl: './documents-dashboard-edit-dialog.component.html',
  styleUrl: './documents-dashboard-edit-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentsDashboardEditDialogComponent {
  documentForm: FormGroup;
  protected readonly documentStatus = DocumentStatus;
  protected readonly documentStatusRelatedName = documentStatusRelatedName;

  constructor(
    private readonly fb: FormBuilder,
    public dialogRef: MatDialogRef<DocumentsDashboardEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DocumentData
  ) {
    this.documentForm = this.fb.group({
      name: [{value: data.name, disabled: data.isReviewer}, Validators.required],
      status: [{value: data.status, disabled: !data.isReviewer}, Validators.required],
    });
  }

  save(): void {
    if (this.documentForm.valid) {
      this.dialogRef.close(this.documentForm.value);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  protected readonly document = document;
}

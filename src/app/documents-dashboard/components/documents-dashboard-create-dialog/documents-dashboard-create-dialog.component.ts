import {ChangeDetectionStrategy, Component, ElementRef, inject, Inject, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DocumentStatus} from '../../state/documents-dashboard.model';
import {ErrorHandlerService} from '../../../shared/error-handler.service';

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
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  formGroup: FormGroup;
  file: File | null = null;
  protected readonly documentStatus = DocumentStatus;
  private readonly errorHandler = inject(ErrorHandlerService);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DocumentsDashboardCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DocumentData
  ) {
    this.formGroup = this.fb.group({
      name: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      file: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required]
      })
    });
  }

  public get name() {
    return this.formGroup.controls['name'];
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      if (this.isPdf(file)) {
        this.file = file;
        this.formGroup.patchValue({file: this.file});
      } else {
        this.errorHandler.showErrorMessage('Only PDF files are allowed.');
      }
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      if (this.isPdf(file)) {
        this.file = file;
        this.formGroup.patchValue({file: this.file});
      } else {
        this.errorHandler.showErrorMessage('Only PDF files are allowed.');
      }
    }
  }

  clearFile(): void {
    this.file = null;
    this.formGroup.patchValue({file: null});
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  submit(status: DocumentStatus.draft | DocumentStatus.readyForReview): void {
    if (this.formGroup.valid && this.file) {
      const formData = new FormData();
      formData.append('name', this.name.value);
      formData.append('file', this.file);
      formData.append('status', status);

      this.dialogRef.close(formData);
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  private isPdf(file: File): boolean {
    return file.type === 'application/pdf';
  }
}

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DocumentsDashboardCreateDialogComponent} from './documents-dashboard-create-dialog.component';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReactiveFormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DocumentStatus} from '../../state/documents-dashboard.model';
import {ErrorHandlerService} from '../../../shared/services/error-handler.service';

const dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);
const errorHandlerMock = jasmine.createSpyObj('ErrorHandlerService', ['showErrorMessage']);

describe('DocumentsDashboardCreateDialogComponent', () => {
  let component: DocumentsDashboardCreateDialogComponent;
  let fixture: ComponentFixture<DocumentsDashboardCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentsDashboardCreateDialogComponent],
      imports: [
        BrowserAnimationsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatIcon
      ],
      providers: [
        {provide: MatDialogRef, useValue: dialogRefMock},
        {provide: ErrorHandlerService, useValue: errorHandlerMock}
      ],
    })
      .compileComponents();

    dialogRefMock.close.calls.reset();
    fixture = TestBed.createComponent(DocumentsDashboardCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with name and file fields', () => {
    expect(component.formGroup.controls['name']).toBeDefined();
    expect(component.formGroup.controls['file']).toBeDefined();
    expect(component.formGroup.valid).toBeFalsy();
  });

  it('should handle valid PDF file selection', () => {
    const file = new File([''], 'test.pdf', {type: 'application/pdf'});
    const event = {target: {files: [file]}} as unknown as Event;
    component.onFileChange(event);
    expect(component.formGroup.value.file).toEqual(file);
    expect(component.file).toEqual(file);
  });

  it('should show error message for invalid file type', () => {
    const file = new File([''], 'test.txt', {type: 'text/plain'});
    const event = {target: {files: [file]}} as unknown as Event;
    component.onFileChange(event);
    expect(errorHandlerMock.showErrorMessage).toHaveBeenCalledWith('Only PDF files are allowed.');
    expect(component.formGroup.value.file).toBeNull();
    expect(component.file).toBeNull();
  });

  it('should handle file drag-and-drop', () => {
    const file = new File([''], 'test.pdf', {type: 'application/pdf'});
    const event = {
      dataTransfer: {files: [file]},
      preventDefault: jasmine.createSpy()
    } as unknown as DragEvent;
    component.onDrop(event);
    expect(component.formGroup.value.file).toEqual(file);
    expect(component.file).toEqual(file);
  });

  it('should show error message for invalid file on drag-and-drop', () => {
    const file = new File([''], 'test.txt', {type: 'text/plain'});
    const event = {
      dataTransfer: {files: [file]},
      preventDefault: jasmine.createSpy()
    } as unknown as DragEvent;
    component.onDrop(event);
    expect(component.formGroup.value.file).toBeNull();
    expect(component.file).toBeNull();
    expect(errorHandlerMock.showErrorMessage).toHaveBeenCalledWith('Only PDF files are allowed.');
  });

  it('should clear file input correctly', () => {
    component.file = new File([''], 'test.pdf', {type: 'application/pdf'});
    component.clearFile();
    expect(component.file).toBeNull();
    expect(component.formGroup.value.file).toBeNull();
    expect(component.fileInput.nativeElement.value).toBe('');
  });

  it('should submit form with valid data', () => {
    const file = new File([''], 'test.pdf', {type: 'application/pdf'});
    component.formGroup.setValue({name: 'Test Document', file});
    component.file = file;
    const formData = new FormData();
    formData.append('name', 'Test Document');
    formData.append('file', file);
    formData.append('status', DocumentStatus.draft);
    component.submit(DocumentStatus.draft);
    expect(dialogRefMock.close).toHaveBeenCalledWith(formData);
  });

  it('should not call dialogRef.close if the form is invalid', () => {
    component.formGroup.patchValue({name: ''});
    component.formGroup.markAllAsTouched();
    component.formGroup.updateValueAndValidity();
    fixture.detectChanges();
    component.submit(DocumentStatus.draft);
    expect(component.formGroup.valid).toBeFalse();
    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });

  it('should close the dialog', () => {
    component.close();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });
});

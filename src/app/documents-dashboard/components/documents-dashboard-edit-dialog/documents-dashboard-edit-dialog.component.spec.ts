import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DocumentsDashboardEditDialogComponent} from './documents-dashboard-edit-dialog.component';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';

const dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);

describe('DocumentsDashboardEditDialogComponent', () => {
  let component: DocumentsDashboardEditDialogComponent;
  let fixture: ComponentFixture<DocumentsDashboardEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentsDashboardEditDialogComponent],
      imports: [
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {id: '1', name: 'Test Document', isReviewer: false}
        },
        {provide: MatDialogRef, useValue: dialogRefMock}
      ],
    })
      .compileComponents();

    dialogRefMock.close.calls.reset();
    fixture = TestBed.createComponent(DocumentsDashboardEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with MAT_DIALOG_DATA', () => {
    expect(component.documentForm.value).toEqual({
      name: 'Test Document',
    });
  });

  it('should enable name field if isReviewer is false', () => {
    const nameControl = component.documentForm.get('name');
    expect(nameControl?.disabled).toBe(false);
  });

  it('should disable status field if isReviewer is false', () => {
    const statusControl = component.documentForm.get('status');
    expect(statusControl?.disabled).toBe(true);
  });

  it('should call dialogRefMock.close with form values on save if the form is valid', () => {
    component.documentForm.patchValue({name: 'Updated Document'});
    component.save();
    expect(dialogRefMock.close).toHaveBeenCalledWith({name: 'Updated Document'});
  });

  it('should not call dialogRefMock.close if the form is invalid', () => {
    component.documentForm.patchValue({name: ''});
    component.documentForm.markAllAsTouched();
    component.documentForm.updateValueAndValidity();
    fixture.detectChanges();
    component.save();
    expect(component.documentForm.valid).toBeFalse();
    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });


  it('should call dialogRefMock.close with no value on cancel', () => {
    component.cancel();
    expect(dialogRefMock.close).toHaveBeenCalledWith();
  });
});

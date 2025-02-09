import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ConfirmDialogComponent} from './confirm-dialog.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

const dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {title: 'Test Title', message: 'Test Message', confirmText: 'Yes', cancelText: 'No'}
        },
        {provide: MatDialogRef, useValue: dialogRefMock}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title and message', () => {
    const titleElement = fixture.nativeElement.querySelector('h2');
    const messageElement = fixture.nativeElement.querySelector('mat-dialog-content');

    expect(titleElement).toBeTruthy();
    expect(messageElement).toBeTruthy();

    expect(titleElement.textContent).toContain('Test Title');
    expect(messageElement.textContent).toContain('Test Message');
  });

  it('should call dialogRefMock.close(false) on cancel', () => {
    component.onCancel();
    expect(dialogRefMock.close).toHaveBeenCalledWith(false);
  });

  it('should call dialogRefMock.close(true) on confirm', () => {
    component.onConfirm();
    expect(dialogRefMock.close).toHaveBeenCalledWith(true);
  });

  it('should use custom confirm and cancel text if provided', async () => {

    const confirmButton = fixture.nativeElement.querySelector('.confirm-button');
    const cancelButton = fixture.nativeElement.querySelector('.cancel-button');

    expect(confirmButton).toBeTruthy();
    expect(cancelButton).toBeTruthy();

    expect(confirmButton.textContent).toContain('Yes');
    expect(cancelButton.textContent).toContain('No');
  });
});

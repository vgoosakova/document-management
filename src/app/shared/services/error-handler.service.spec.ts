import {TestBed} from '@angular/core/testing';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ErrorHandlerService} from './error-handler.service';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    TestBed.configureTestingModule({
      providers: [
        ErrorHandlerService,
        {provide: MatSnackBar, useValue: snackBarSpy},
      ],
    });

    service = TestBed.inject(ErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call snackBar.open when showErrorMessage is called', () => {
    const message = 'Error occurred!';
    service.showErrorMessage(message);

    expect(snackBarSpy.open).toHaveBeenCalledWith(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      verticalPosition: 'top',
    });
  });

  it('should call snackBar.open when showSuccessMessage is called', () => {
    const message = 'Operation successful!';
    service.showSuccessMessage(message);

    expect(snackBarSpy.open).toHaveBeenCalledWith(message, 'Close', {
      duration: 5000,
      panelClass: ['success-snackbar'],
      verticalPosition: 'top',
    });
  });
});

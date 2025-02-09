import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

/**
 * ErrorHandlerService
 *
 * Handles displaying error notifications globally.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private snackBar: MatSnackBar) {
  }

  /**
   * Displays an error message.
   *
   * @param message - The error message to display.
   */
  showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      verticalPosition: 'top',
    });
  }

  /**
   * Displays a success message.
   *
   * @param message - The success message to display.
   */
  showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['success-snackbar'],
      verticalPosition: 'top',
    });
  }
}

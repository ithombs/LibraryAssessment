import { Component, Inject, inject } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BookService } from '../../services/book.service';
import { Book } from '../../interfaces/book';
import { MatButton } from '@angular/material/button';
import { MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-delete-warning-modal',
  standalone: true,
  imports: [MatDialogModule, MatButton, MatLabel],
  templateUrl: './delete-warning-modal.component.html',
  styleUrl: './delete-warning-modal.component.css'
})
export class DeleteWarningModalComponent {
  bookService : BookService = inject(BookService);

  constructor(public dialogRef: MatDialogRef<DeleteWarningModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Book
  ){
  }

  deleteBook(){
    this.bookService.DeleteBook(this.data);
    this.dialogRef.close({event: "mod"});
  }
}

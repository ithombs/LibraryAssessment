import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { Book } from '../../interfaces/book';

@Component({
  selector: 'app-description-dialog',
  standalone: true,
  imports: [MatDialogModule, MatDialogContent],
  templateUrl: './description-dialog.component.html',
  styleUrl: './description-dialog.component.css'
})
export class DescriptionDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Book) {}
}

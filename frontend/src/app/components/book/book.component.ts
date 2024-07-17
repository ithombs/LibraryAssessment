import { Component, Input } from '@angular/core';
import { Book } from '../../interfaces/book';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DescriptionDialogComponent } from '../description-dialog/description-dialog.component';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [RouterModule, MatButtonModule, MatTooltipModule],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent {
  @Input() book!: Book;

  constructor(public dialog: MatDialog) {}

  openDescriptionDialog(){
    this.dialog.open(DescriptionDialogComponent, {data: this.book});
  }
}

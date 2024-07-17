import { Component, Input } from '@angular/core';
import { BookReview } from '../../interfaces/book-review';

@Component({
  selector: 'app-book-review',
  standalone: true,
  imports: [],
  templateUrl: './book-review.component.html',
  styleUrl: './book-review.component.css'
})
export class BookReviewComponent {
  @Input() bookReview!: BookReview;
}

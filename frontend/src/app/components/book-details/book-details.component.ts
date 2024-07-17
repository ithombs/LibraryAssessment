import { Component, OnInit, inject } from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../interfaces/book';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BookReview } from '../../interfaces/book-review';
import { BookReviewComponent } from '../book-review/book-review.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditBookModalComponent } from '../edit-book-modal/edit-book-modal.component';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { CreateReviewModalComponent } from '../create-review-modal/create-review-modal.component';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginService } from '../../services/login.service';
import { DeleteWarningModalComponent } from '../delete-warning-modal/delete-warning-modal.component';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, BookReviewComponent, EditBookModalComponent, MatButtonModule, 
      CreateReviewModalComponent, RouterModule, MatMenuModule],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent implements OnInit{
  //onInit - fetch details for this book and display on screen. If user is Librarian then show details as form
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  bookService = inject(BookService);
  loginService = inject(LoginService);
  helper = new JwtHelperService();
  
  book: Book | undefined;
  book2$!: Observable<Book>;
  bookReviews$!: Observable<BookReview[]>
  readonly dialog =  inject(MatDialog);

  bookId : number = 0;
  constructor(){
    const bookId = Number(this.route.snapshot.params['id']);
    this.bookId = bookId;
  }
  

  isUserLibrarian(){
    return this.loginService.isUserLibrarian();
  }

  isUserAuthenticated(){
    return this.loginService.isUserAuthenticated();
  }

  ngOnInit(): void {
    //this.book = this.bookService.getBookDetailsByIdDemo(this.bookId);
    this.book2$ = this.bookService.getBookDetailsById(this.bookId);
    this.bookReviews$ = this.bookService.getReviewsByBookId(this.bookId);
  }

  checkoutBook(book : Book){
    this.bookService.CheckoutBook(book).subscribe({
      next: (response) => {
        console.log(response);
        this.book2$ = this.bookService.getBookDetailsById(this.bookId);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  returnBook(book : Book){
    this.bookService.MarkBookAsReturned(book).subscribe({
      next: (response) => {
        console.log(response);
        this.book2$ = this.bookService.getBookDetailsById(this.bookId);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  openDialog(book: Book){
    //console.log(book);
    let dialogRef = this.dialog.open(EditBookModalComponent, {data: book, width: '700px'});
    dialogRef.afterClosed().subscribe(result => { 
      if(result != null && result.event == "mod"){
        this.book2$ = this.bookService.getBookDetailsById(this.bookId);
      }
    })
  }

  openDeleteDialog(book: Book){
    let dialogRef = this.dialog.open(DeleteWarningModalComponent, {data: book });
    dialogRef.afterClosed().subscribe(result => { 
      if(result != null && result.event == "mod"){
        //Reroute to main page
        //this.book2$ = this.bookService.getBookDetailsById(this.bookId);
        this.router.navigateByUrl('/')
      }
    })
  }

  openReviewDialog(book: Book){
    let dialogRef = this.dialog.open(CreateReviewModalComponent, {width: '700px', data: book});
    dialogRef.afterClosed().subscribe(result => { 
      if(result != null && result.event == "mod"){
        this.bookReviews$ = this.bookService.getReviewsByBookId(this.bookId);
      }
    })
  }
}

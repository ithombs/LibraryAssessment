import { Injectable, inject } from '@angular/core';
import { Book } from '../interfaces/book';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookReview } from '../interfaces/book-review';
import { BookQueryParams } from '../interfaces/book-query-params';
import { BookReviewRequest } from '../interfaces/book-review-request';
import { Checkout } from '../interfaces/checkout';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  LOGIN_URL: string = "https://localhost:7184/api/User/register";
  BOOK_URL: string = "https://localhost:7184/api/Books/";
  BOOK_REVIEWS_URL: string = "https://localhost:7184/api/BookReviews/";
  BOOK_REVIEWS_BY_USER_URL : string = "https://localhost:7184/api/BookReviews/UserBookReview/"
  BOOK_USER_CHECKOUTS_URL : string = "https://localhost:7184/api/Books/ActiveCheckoutsByUser/";
  BOOK_ALL_CHECKOUTS_URL : string = "https://localhost:7184/api/Books/ActiveCheckouts/";

  http: HttpClient = inject(HttpClient);

  constructor() {

  }

  getActiveCheckoutsByUser() : Observable<Checkout[]>{
    return this.http.get<Checkout[]>(this.BOOK_USER_CHECKOUTS_URL);
  }

  getAllActiveCheckouts() : Observable<Checkout[]>{
    return this.http.get<Checkout[]>(this.BOOK_ALL_CHECKOUTS_URL);
  }

  AddBook(newBook : Book): void{
    this.http.post<Book>(this.BOOK_URL, newBook, {
      headers: new HttpHeaders({ "Content-Type": "application/json"})
    })
    .subscribe({
      next: (response: Book) => {
        console.log(response);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    })
  }

  UpdateBook(book : Book): void{
    this.http.put<Book>(this.BOOK_URL + book.id, book, {
      headers: new HttpHeaders({ "Content-Type": "application/json"})
    })
    .subscribe({
      next: (response: Book) => {
        console.log(response);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    })
  }

  DeleteBook(book : Book): void{
    this.http.delete<any>(this.BOOK_URL + book.id)
    .subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    })
  }

  CheckoutBook(book : Book): Observable<any>{
    return this.http.post<any>(this.BOOK_URL + "Checkout/" + book.id, {}, {
      headers: new HttpHeaders({ "Content-Type": "application/json"})
    })
  }

  MarkBookAsReturned(book : Book): Observable<any>{
    return this.http.post<any>(this.BOOK_URL + "Return/" + book.id, {}, {
      headers: new HttpHeaders({ "Content-Type": "application/json"})
    })
  }

  AddBookReview(newBookReview : BookReviewRequest): void{
    this.http.post<BookReview>(this.BOOK_REVIEWS_URL, newBookReview, {
      headers: new HttpHeaders({ "Content-Type": "application/json"})
    })
    .subscribe({
      next: (response: BookReview) => {
        console.log(response);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    })
  }

  UpdateBookReview(updatedBookReview : BookReviewRequest) : void{
    this.http.put<BookReview>(this.BOOK_REVIEWS_URL + updatedBookReview.bookId, updatedBookReview, {
      headers: new HttpHeaders({ "Content-Type": "application/json"})
    })
    .subscribe({
      next: (response: BookReview) => {
        console.log(response);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    })
  }

  getUserBookReviewByBookId(bookId : number){
    return this.http.get<BookReview>(this.BOOK_REVIEWS_BY_USER_URL + bookId);
  }

  getAllBooks(): Observable<Book[]>{
    return this.http.get<Book[]>(this.BOOK_URL);
  }

  getBooks(queryParams : BookQueryParams): Observable<Book[]>{
    let params = new HttpParams();
    
    params = params.set("title", queryParams.title);
    params = params.set("author", queryParams.author);
    params = params.set("orderBy", queryParams.orderBy);
    if(queryParams.isCheckedOut != null){
      params = params.set("isCheckedOut", queryParams.isCheckedOut);
    }
    params = params.set("orderByAsc", queryParams.orderAsc);
    
    return this.http.get<Book[]>(this.BOOK_URL + "FilteredBooks", {params: params});
  }

  getReviewsByBookId(bookId : number): Observable<BookReview[]>{
    return this.http.get<BookReview[]>(this.BOOK_REVIEWS_URL + bookId)
  }

  getFeaturedBooks(): Observable<Book[]>{
    return this.http.get<Book[]>(this.BOOK_URL + "FeaturedBooks");
  }

  getBookDetailsById(bookId: number): Observable<Book>{
      return this.http.get<Book>(this.BOOK_URL + bookId);
  }
}

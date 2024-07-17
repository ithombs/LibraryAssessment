import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { BookComponent } from '../book/book.component';
import { BookService } from '../../services/book.service';
import { CommonModule } from '@angular/common';
import { Book } from '../../interfaces/book';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { BookQueryParams } from '../../interfaces/book-query-params';
import { debounceTime, takeUntil } from 'rxjs';
import { BookDetailsComponent } from '../book-details/book-details.component';
import { BookSearchComponent } from '../book-search/book-search.component';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [BookComponent, CommonModule, RouterModule, FormsModule, BookSearchComponent],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css'
})
export class LibraryComponent implements OnInit, OnDestroy{
  bookService: BookService = inject(BookService);
  books$!: Observable<Book[]>;
  featuredBooks! : Book[];
  filteredFeaturedBooks! : Book[];

  searchSubject = new Subject<string>();

  titleFilter: string = '';
  authorFilter: string = '';
  isCheckedOutFilter: string = '';
  featuredBookSort: string = 'title';

  qParams!: BookQueryParams;

  constructor(){
    this.qParams = {author: "", title: "", isCheckedOut: null, orderAsc: true, orderBy: ""};
  }

  getFeaturedBooks(){
    this.bookService.getFeaturedBooks().subscribe({
      next: (response: Book[]) => {
        this.featuredBooks = response;
        this.filteredFeaturedBooks = response;
        this.filteredFeaturedBooks.sort((a,b) => a.title.localeCompare(b.title));
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  filterFeaturedBooks(){
      this.filteredFeaturedBooks = this.featuredBooks;
      this.filteredFeaturedBooks = this.filteredFeaturedBooks.filter(b => b.title.toLowerCase().includes(this.titleFilter.toLowerCase()));
      this.filteredFeaturedBooks = this.filteredFeaturedBooks.filter(b => b.author.toLowerCase().includes(this.authorFilter.toLowerCase()));
      
      if(this.isCheckedOutFilter === 'true'){
        this.filteredFeaturedBooks = this.filteredFeaturedBooks.filter(b => b.isCheckedOut);
      }else{
        this.filteredFeaturedBooks = this.filteredFeaturedBooks.filter(b => !b.isCheckedOut);
      }

      if(this.featuredBookSort == 'title'){
        this.filteredFeaturedBooks.sort((a,b) => a.title.localeCompare(b.title));
      }else if(this.featuredBookSort == 'author'){
        this.filteredFeaturedBooks.sort((a,b) => a.author.localeCompare(b.author));
      }else{
        this.filteredFeaturedBooks.sort((a,b) => (a.isCheckedOut === b.isCheckedOut)? 0 : a.isCheckedOut? -1 : 1);
      }
      
  }

  /*
  filterFeaturedBooks(){
    this.qParams.author = this.authorFilter;
    this.qParams.title = this.titleFilter;
    this.qParams.isCheckedOut = this.isCheckedOutFilter;

    this.books$ = this.bookService.getBooks(this.qParams);
  }
    */

  onSearch(){
    this.searchSubject.next(this.titleFilter);
  }

  filterOnTitle(searchValue : string){
    this.qParams.title = searchValue;

    this.books$ = this.bookService.getBooks(this.qParams);
  }

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(700))
      .subscribe(searchValue => {
        this.filterOnTitle(searchValue);
      });
    this.books$ = this.bookService.getBooks(this.qParams);
    this.getFeaturedBooks();
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }
}

import { AfterViewInit, Component, Injector, OnInit, ViewChild, inject } from '@angular/core';
import { Book } from '../../interfaces/book';
import { BookService } from '../../services/book.service';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { BookQueryParams } from '../../interfaces/book-query-params';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { EditBookModalComponent } from '../edit-book-modal/edit-book-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-book-search',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatPaginatorModule, MatSortModule, 
    FormsModule, MatFormFieldModule, MatOption, MatFormField, ReactiveFormsModule, 
    MatSelect, MatInput, MatButtonModule, MatIconModule, EditBookModalComponent, MatDialogModule, RouterModule],
  templateUrl: './book-search.component.html',
  styleUrl: './book-search.component.css'
})
export class BookSearchComponent implements OnInit, AfterViewInit{
  bookService : BookService = inject(BookService);
  loginService: LoginService = inject(LoginService);
  bookList : Book[] = [];
  books$? : Observable<Book[]>;
  displayedColumns: string[] = ['title', 'author', 'publisher', 'publicationDate', 'category'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<Book>();

  //searchSubject = new Subject<string>();
  readonly dialog =  inject(MatDialog);

  titleFilter: string = '';
  authorFilter: string = '';
  isCheckedOutFilter!: boolean; 

  qParams!: BookQueryParams;

  constructor(private _liveAnnouncer: LiveAnnouncer) {
    this.qParams = {author: "", title: "", isCheckedOut: null, orderAsc: true, orderBy: ""}
  }

  ngAfterViewInit(): void {
    
  }

  ngOnInit(): void {
    this.bookService.getAllBooks().subscribe(books => {
      //this.bookList = books;
      this.dataSource = new MatTableDataSource(books);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  filterFeaturedBooks(){
    this.qParams.author = this.authorFilter;
    this.qParams.title = this.titleFilter;
    this.qParams.isCheckedOut = this.isCheckedOutFilter;

    this.books$ = this.bookService.getBooks(this.qParams);
    this.books$.subscribe(books =>{
        this.dataSource.data = books;
    }) 
  }

  announceSortChange(sortState: Sort){
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  showAddBookModal(){
    console.log('open add book modal');
    let dialogRef = this.dialog.open(EditBookModalComponent, {width: '700px'});
    dialogRef.afterClosed().subscribe(result => { 
      if(result != null && result.event == "mod"){
        this.books$ = this.bookService.getBooks(this.qParams);
        this.books$.subscribe(books =>{
        this.dataSource.data = books;
      }) 
      }
    })
  }
}

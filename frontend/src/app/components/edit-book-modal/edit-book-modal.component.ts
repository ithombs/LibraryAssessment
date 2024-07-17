import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Book } from '../../interfaces/book';
import { CommonModule, formatDate } from '@angular/common';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormGroup, FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatDateRangePicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptgroup, MatOption, provideNativeDateAdapter } from '@angular/material/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSelect } from '@angular/material/select';
import { BookService } from '../../services/book.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-edit-book-modal',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogContent, MatDialogTitle, 
    MatDialogClose, CommonModule, MatFormField, MatLabel, 
    MatFormFieldModule, FormsModule, MatInputModule, MatDatepickerModule, MatCheckbox, 
    MatSelect, MatOption, ReactiveFormsModule, FormsModule],
    providers:[provideNativeDateAdapter()],
  templateUrl: './edit-book-modal.component.html',
  styleUrl: './edit-book-modal.component.css'
})
export class EditBookModalComponent implements OnInit{
  bookService : BookService = inject(BookService);
  editedBook! : Book;
  dialogTitle: string = "Edit Book";

  bookCategorys : string[] = ["Science Fiction", "Mystery", "Romance", "Thriller", "Non Fiction", "Biography"];

  editBookForm : FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    author: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    coverImage: new FormControl(''),
    publisher: new FormControl('', Validators.required),
    publicationDate: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    isbn: new FormControl('', Validators.required),
    pageCount: new FormControl('', Validators.required),
    //isCheckedOut: new FormControl(''),
    });


  constructor(public dialogRef: MatDialogRef<EditBookModalComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: Book){
  }

  ngOnInit(): void {
    if(this.data != null){
      this.editBookForm.setValue({
        title: this.data?.title,
        author: this.data?.author,
        description: this.data?.description,
        coverImage: "150x150.png",
        publisher: this.data?.publisher,
        publicationDate: this.data?.publicationDate,
        category: this.data?.category,
        isbn: this.data?.isbn,
        pageCount: this.data?.pageCount,
        //isCheckedOut: this.data?.isCheckedOut
      })
    }else{
      this.dialogTitle = "Create Book";
    }
  }


  saveChanges(){
    if(this.editBookForm.valid){
      console.log(this.editedBook);
      if(this.data == null){
        this.editedBook = {
          id : 0,
          title: this.editBookForm.value.title,
          author: this.editBookForm.value.author,
          description: this.editBookForm.value.description,
          coverImage: "150x150.png",
          publisher: this.editBookForm.value.publisher,
          publicationDate: formatDate(this.editBookForm.value.publicationDate, 'yyyy-MM-dd', 'en'),
          category: this.editBookForm.value.category,
          isbn: this.editBookForm.value.isbn,
          pageCount: this.editBookForm.value.pageCount,
          isCheckedOut: false,
          averageRating: 0
        }
        this.bookService.AddBook(this.editedBook);
        console.log("Created new book!");
      }else{
        this.editedBook = {
          id : this.data.id,
          title: this.editBookForm.value.title,
          author: this.editBookForm.value.author,
          description: this.editBookForm.value.description,
          coverImage: this.editBookForm.value.coverImage,
          publisher: this.editBookForm.value.publisher,
          publicationDate: this.editBookForm.value.publicationDate,
          category: this.editBookForm.value.category,
          isbn: this.editBookForm.value.isbn,
          pageCount: this.editBookForm.value.pageCount,
          isCheckedOut: this.data.isCheckedOut,
          averageRating: 0
        }
  
        this.bookService.UpdateBook(this.editedBook);
        console.log('Saved book edit!');
        
      }

      this.dialogRef.close({event: 'mod'});
    }    
  }
}

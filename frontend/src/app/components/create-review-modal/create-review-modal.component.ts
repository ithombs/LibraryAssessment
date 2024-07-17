import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlider, MatSliderModule } from '@angular/material/slider';
import { BookService } from '../../services/book.service';
import { LoginService } from '../../services/login.service';
import { BookReviewRequest } from '../../interfaces/book-review-request';
import { Book } from '../../interfaces/book';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-review-modal',
  standalone: true,
  imports: [MatDialogModule, MatFormField, MatLabel, MatDialogClose, MatButton, 
    MatInputModule, FormsModule, MatSliderModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-review-modal.component.html',
  styleUrl: './create-review-modal.component.css'
})
export class CreateReviewModalComponent implements OnInit{

  constructor(public dialogRef: MatDialogRef<CreateReviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Book
  ){
  }
  bookService : BookService = inject(BookService);
  loginService : LoginService = inject(LoginService);

  hasReview? : boolean;
  review? : BookReviewRequest;

  createReviewForm : FormGroup = new FormGroup({
    rating: new FormControl(1),
    review: new FormControl('') 
  });

  ngOnInit(): void {
    this.bookService.getUserBookReviewByBookId(this.data.id).subscribe( data =>{
      this.review = data;
      if(data != null){
        this.createReviewForm.patchValue({
          rating: data.rating,
          review: data.review
        });
        //this.createReviewForm.value.rating = data.rating;
        //this.createReviewForm.value.review = data.review;
        this.hasReview = true;
      }
      else{
        this.hasReview = false;
      }
    });
  }
  
  getUserReview(){
    
  }

  formatLabel(value: number): string {
    if (value >= 5) {
      return '5';
    }

    return `${value}`;
  }
  saveChanges(){
    //console.log("Created review!");
    //console.log(this.data);

    //if hasReview and reviewData changed, do PUT
    if(this.hasReview){
      if(this.reviewHasChanged()){
        this.review = 
        {
          bookId: this.data.id, 
          rating: this.createReviewForm.value.rating,
          review: this.createReviewForm.value.review
        }
        this.bookService.UpdateBookReview(this.review);
      }
    }else{
      this.review = 
        {
          bookId: this.data.id, 
          rating: this.createReviewForm.value.rating,
          review: this.createReviewForm.value.review
        }
      this.bookService.AddBookReview(this.review);
    }

    this.dialogRef.close({event: 'mod'});
  }

  reviewHasChanged(){
    if(this.review?.rating != this.createReviewForm.value.rating || this.review?.review != this.createReviewForm.value.review){
      return true;
    }
    return false;
  }
}

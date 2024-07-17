import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BookService } from '../../services/book.service';
import { Checkout } from '../../interfaces/checkout';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-checkouts',
  standalone: true,
  imports: [MatTableModule, CommonModule, RouterModule],
  templateUrl: './user-checkouts.component.html',
  styleUrl: './user-checkouts.component.css'
})
export class UserCheckoutsComponent implements OnInit{
  bookService : BookService = inject(BookService);
  displayedColumns: string[] = ['title', 'startDate', 'dueDate'];
  dataSource = new MatTableDataSource<Checkout>();

  BORROW_LENGTH : number = 5;

  ngOnInit(): void {
    this.bookService.getActiveCheckoutsByUser().subscribe(checkouts => {
      this.dataSource = new MatTableDataSource(checkouts);
    })
  }

  getStartDate(startDate: Date){
    return formatDate(startDate, 'yyyy-MM-dd', 'en');
  }

  getDueDate(startDate : Date){
    let endDate = new Date();
    endDate.setDate((new Date(startDate).getDate() + this.BORROW_LENGTH));
    return formatDate(endDate, 'yyyy-MM-dd', 'en');
  }
}

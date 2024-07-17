import { Component, OnInit, inject } from '@angular/core';
import { BookService } from '../../services/book.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Checkout } from '../../interfaces/checkout';
import { CommonModule, formatDate } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-checkouts',
  standalone: true,
  imports: [MatTableModule, CommonModule, RouterModule],
  templateUrl: './admin-checkouts.component.html',
  styleUrl: './admin-checkouts.component.css'
})
export class AdminCheckoutsComponent implements OnInit{
  bookService : BookService = inject(BookService);
  displayedColumns: string[] = ['title', 'user', 'startDate', 'dueDate'];
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

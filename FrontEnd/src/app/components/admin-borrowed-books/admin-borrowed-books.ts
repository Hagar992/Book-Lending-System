import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book';
import { AuthService } from '../../services/auth';
import { Book } from '../../models/book.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-borrowed-books',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-borrowed-books.html',
  styleUrls: ['./admin-borrowed-books.css']
})
export class AdminBorrowedBooks implements OnInit {
  borrowedBooks: Book[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private bookService: BookService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadBorrowedBooks();
  }

  loadBorrowedBooks(): void {
    this.loading = true;
    this.errorMessage = '';
    try {
      this.borrowedBooks = this.bookService.getBooks().filter(book => !book.available);
    } catch (error) {
     this.errorMessage = 'Failure To Download Borrowed Books';
    } finally {
      this.loading = false;
    }
  }
}
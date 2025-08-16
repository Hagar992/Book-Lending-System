import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book';
import { AuthService } from '../../services/auth';
import { Book } from '../../models/book.model';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators'; // ✅ ضروري لاستخدام pipe(map)
import { Observable } from 'rxjs';

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

    this.bookService.getBooks().pipe(
      map((books: Book[]) =>
        books.filter((book: Book) => !book.available)
      )
    ).subscribe({
      next: (filteredBooks: Book[]) => {
        this.borrowedBooks = filteredBooks;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'فشل في تحميل الكتب المستعارة.';
        this.loading = false;
      }
    });
  }
}

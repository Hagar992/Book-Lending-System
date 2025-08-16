import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book';
import { AuthService } from '../../services/auth';
import { Book } from '../../models/book.model';
import { CommonModule, DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-borrowed-books',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './user-borrowed-books.html',
  styleUrls: ['./user-borrowed-books.css']
})
export class UserBorrowedBooks implements OnInit {
  borrowedBooks: Book[] = [];
  loading = true;
  errorMessage = '';

  constructor(private bookService: BookService, public authService: AuthService) {}

  ngOnInit(): void {
    this.loadBorrowedBooks();
  }

  loadBorrowedBooks(): void {
    this.loading = true;
    this.errorMessage = '';
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.loading = false;
      return;
    }
    this.bookService.getBooks().pipe(
      map((books: Book[]) => books.filter((book: Book) => !book.available && book.userId === currentUser.email))
    ).subscribe({
      next: (filteredBooks: Book[]) => {
        this.borrowedBooks = filteredBooks;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'فشل في تحميل الكتب المستعارة';
        this.loading = false;
      }
    });
  }

  returnBook(book: Book): void {
    this.loading = true;
    this.errorMessage = '';
    this.bookService.updateBook({
      ...book,
      available: true,
      userId: undefined,
      borrowedDate: undefined,
      dueDate: undefined
    }).subscribe({
      next: () => {
        this.loadBorrowedBooks(); // إعادة تحميل الكتب بعد النجاح
      },
      error: () => {
        this.errorMessage = 'فشل في إرجاع الكتاب';
      }
    }).add(() => {
      this.loading = false;
    });
  }
}
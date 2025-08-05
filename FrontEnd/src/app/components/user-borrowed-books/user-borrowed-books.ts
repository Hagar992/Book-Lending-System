import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book';
import { AuthService } from '../../services/auth';
import { Book } from '../../models/book.model';
import { CommonModule, DatePipe } from '@angular/common'; // أضفنا DatePipe

@Component({
  selector: 'app-user-borrowed-books',
  standalone: true,
  imports: [CommonModule,DatePipe],
  templateUrl: './user-borrowed-books.html',
  styleUrls: ['./user-borrowed-books.css']
})
export class UserBorrowedBooks implements OnInit {
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
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        this.borrowedBooks = this.bookService.getBooks().filter(book => 
          !book.available && book.userId === currentUser.email
        );
      }
    } catch (error) {
      this.errorMessage = 'Failure To Download Borrowed Books';
    } finally {
      this.loading = false;
    }
  }

  returnBook(book: Book): void {
    this.loading = true;
    this.errorMessage = '';
    try {
      book.available = true;
      book.userId = null; // صار مقبول بسبب التعديل في model
      book.borrowedDate = null; // صار مقبول بسبب التعديل في model
      book.dueDate = null; // صار مقبول بسبب التعديل في model
      this.bookService.updateBook(book); // تحديث البيانات
      this.loadBorrowedBooks(); // إعادة تحميل القائمة
    } catch (error) {
      this.errorMessage = 'Failure To Return The Book';
    } finally {
      this.loading = false;
    }
  }
}
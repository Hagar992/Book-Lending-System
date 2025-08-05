import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../../services/book';
import { Book } from '../../../models/book.model';
import { AuthService } from '../../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-details.html',
  styleUrls: ['./book-details.css']
})
export class BookDetails implements OnInit {
  book: Book = { id: 0, title: '', author: '', available: true, coverUrl: '' };
  editMode: boolean = false;
  hasBorrowedBook: boolean = false;
  borrowedBookId: number | null = null;
  dueDate: string | null = null;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const bookIdParam = this.route.snapshot.paramMap.get('id');
    if (bookIdParam) {
      const bookId = Number(bookIdParam);
      this.book = this.bookService.getBookById(bookId) || this.book;
      this.checkBorrowedStatus();
    }
  }

  checkBorrowedStatus(): void {
    this.loading = true;
    this.errorMessage = '';
    try {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        const borrowedBooks = this.bookService.getBooks().filter(b => !b.available);
        const myBorrowedBook = borrowedBooks.find(b => b.id === this.book.id && this.getBorrowedUserId(b) === currentUser.email);
        if (myBorrowedBook) {
          this.hasBorrowedBook = true;
          this.borrowedBookId = myBorrowedBook.id;
          this.dueDate = myBorrowedBook.dueDate || null;
        } else {
          this.hasBorrowedBook = false;
          this.borrowedBookId = null;
          this.dueDate = null;
        }
      }
    } catch (error) {
      this.errorMessage = 'فشل في تحميل حالة الاستعارة';
    } finally {
      this.loading = false;
    }
  }

  private getBorrowedUserId(book: Book): string | null {
    return book.userId || null;
  }

  toggleEditMode(): void {
    if (this.authService.isAdmin()) {
      this.editMode = !this.editMode;
    } else {
      this.errorMessage = 'لا يمكنك تعديل البيانات، يرجى الاتصال بالمسؤول.';
    }
  }

  saveChanges(): void {
    this.bookService.updateBook(this.book);
    this.editMode = false;
    this.router.navigate(['/admin/books']);
  }

  cancel(): void {
    this.editMode = false;
    this.router.navigate(['/admin/books']);
  }

  borrowBook(): void {
    this.loading = true;
    this.errorMessage = '';
    if (this.book.available && !this.hasBorrowedBook) {
      try {
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          this.book.available = false;
          this.hasBorrowedBook = true;
          this.borrowedBookId = this.book.id;
          this.dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
          this.book.userId = currentUser.email;
          this.book.borrowedDate = new Date().toISOString(); // تاريخ الاستعارة
          this.bookService.updateBook(this.book);
        }
      } catch (error) {
        this.errorMessage = 'فشل في استعارة الكتاب';
      } finally {
        this.loading = false;
      }
    } else {
      this.errorMessage = 'الكتاب مستعار بالفعل أو عندك كتاب معار حاليًا.';
    }
  }

  returnBook(): void {
    this.loading = true;
    this.errorMessage = '';
    const currentUser = this.authService.getCurrentUser();
    if (!this.book.available && this.borrowedBookId === this.book.id && this.getBorrowedUserId(this.book) === currentUser?.email) {
      try {
        this.book.available = true;
        this.hasBorrowedBook = false;
        this.borrowedBookId = null;
        this.dueDate = null;
        this.book.userId = null; // مسح معرف المستخدم
        this.book.borrowedDate = null; // مسح تاريخ الاستعارة
        this.bookService.updateBook(this.book);
      } catch (error) {
        this.errorMessage = 'فشل في إرجاع الكتاب';
      } finally {
        this.loading = false;
      }
    } else {
      this.errorMessage = 'لا يمكنك إرجاع كتاب لم تستعره أو الكتاب متاح بالفعل.';
    }
  }
}
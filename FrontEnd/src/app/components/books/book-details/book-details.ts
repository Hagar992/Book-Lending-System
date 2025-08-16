import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../../services/book';
import { Book } from '../../../models/book.model';
import { AuthService } from '../../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-details.html',
  styleUrls: ['./book-details.css']
})
export class BookDetails implements OnInit {
  book: Book = { 
  id: 0, 
  title: '', 
  author: '', 
  available: true, 
  coverUrl: '',
  publishedDate: '' 
};

  editMode: boolean = false;
  hasBorrowedBook: boolean = false;
  borrowedBookId: number | null = null;
  dueDate: string | undefined = undefined; // تغيير من string | null إلى string | undefined
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
      this.bookService.getBookById(bookId).subscribe({
        next: (book: Book) => {
          this.book = book;
          this.checkBorrowedStatus();
        },
        error: () => {
          this.errorMessage = 'فشل في تحميل بيانات الكتاب';
        }
      });
    }
  }

  checkBorrowedStatus(): void {
    this.loading = true;
    this.errorMessage = '';
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.loading = false;
      return;
    }
    this.bookService.getBooks().pipe(
      map((books: Book[]) => books.find((b: Book) => b.id === this.book.id && !b.available && b.userId === currentUser.email))
    ).subscribe({
      next: (borrowedBook: Book | undefined) => {
        if (borrowedBook) {
          this.hasBorrowedBook = true;
          this.borrowedBookId = borrowedBook.id;
          this.dueDate = borrowedBook.dueDate; // يمكن يكون undefined
        } else {
          this.hasBorrowedBook = false;
          this.borrowedBookId = null;
          this.dueDate = undefined;
        }
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'فشل في تحميل حالة الاستعارة';
        this.loading = false;
      }
    });
  }

  toggleEditMode(): void {
    if (this.authService.isAdmin()) {
      this.editMode = !this.editMode;
    } else {
      this.errorMessage = 'لا يمكنك تعديل البيانات، يرجى الاتصال بالمسؤول.';
    }
  }

  saveChanges(): void {
    this.bookService.updateBook(this.book).subscribe({
      next: () => {
        this.editMode = false;
        this.router.navigate(['/admin/books']);
      },
      error: () => {
        this.errorMessage = 'فشل في حفظ التغييرات';
      }
    });
  }

  cancel(): void {
    this.editMode = false;
    this.router.navigate(['/admin/books']);
  }

  borrowBook(): void {
    this.loading = true;
    this.errorMessage = '';
    if (this.book.available && !this.hasBorrowedBook) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        const updatedBook = {
          ...this.book,
          available: false,
          userId: currentUser.email,
          borrowedDate: new Date().toISOString(),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        };
        this.bookService.updateBook(updatedBook).subscribe({
          next: () => {
            this.book = updatedBook;
            this.hasBorrowedBook = true;
            this.borrowedBookId = this.book.id;
            this.dueDate = this.book.dueDate; // يمكن يكون string
          },
          error: () => {
            this.errorMessage = 'فشل في استعارة الكتاب';
          }
        });
      }
    } else {
      this.errorMessage = 'الكتاب مستعار بالفعل أو عندك كتاب معار حاليًا.';
    }
    this.loading = false;
  }

  returnBook(): void {
    this.loading = true;
    this.errorMessage = '';
    const currentUser = this.authService.getCurrentUser();
    if (!this.book.available && this.borrowedBookId === this.book.id && this.book.userId === currentUser?.email) {
      const updatedBook = {
        ...this.book,
        available: true,
        userId: undefined,
        borrowedDate: undefined,
        dueDate: undefined
      };
      this.bookService.updateBook(updatedBook).subscribe({
        next: () => {
          this.book = updatedBook;
          this.hasBorrowedBook = false;
          this.borrowedBookId = null;
          this.dueDate = undefined; // يمكن يكون undefined
        },
        error: () => {
          this.errorMessage = 'فشل في إرجاع الكتاب';
        }
      });
    } else {
      this.errorMessage = 'لا يمكنك إرجاع كتاب لم تستعره أو الكتاب متاح بالفعل.';
    }
    this.loading = false;
  }
}
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
  dueDate: string | undefined = undefined; 
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
          this.errorMessage = 'Failure to download book data';
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
          this.dueDate = borrowedBook.dueDate; 
          this.hasBorrowedBook = false;
          this.borrowedBookId = null;
          this.dueDate = undefined;
        }
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failure to download the metaphor';
        this.loading = false;
      }
    });
  }

  

  saveChanges(): void {
    this.bookService.updateBook(this.book).subscribe({
      next: () => {
        this.editMode = false;
        this.router.navigate(['/admin/books']);
      },
      error: () => {
        this.errorMessage ='Failure to save changes';
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
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // بعد 7 أيام
      };
      this.bookService.updateBook(updatedBook).subscribe({
        next: () => {
          this.book = updatedBook;
          this.hasBorrowedBook = true;
          this.borrowedBookId = this.book.id;
          this.dueDate = this.book.dueDate; 
        },
        error: () => {
          this.errorMessage = 'Failure to borrow the book';
        }
      });
    }
  } else {
    this.errorMessage = 'The book is already borrowed or you have a currently loaned book.';
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
          this.dueDate = undefined; 
        },
        error: () => {
          this.errorMessage = 'Failure to return the book';
        }
      });
    } else {
      this.errorMessage = "You cannot return a book that you did not borrow or the book is already available.";
    }
    this.loading = false;
  }
}
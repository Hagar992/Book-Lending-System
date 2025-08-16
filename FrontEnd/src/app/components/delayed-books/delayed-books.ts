import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book';
import { Book } from '../../models/book.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-delayed-books',
  templateUrl: './delayed-books.html',
  styleUrls: ['./delayed-books.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DelayedBooks implements OnInit {
  delayedBooks: Book[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadDelayedBooks();
  }

  loadDelayedBooks(): void {
    const currentDate = new Date();

    this.bookService.getBooks().pipe(
      map((books: Book[]) =>
        books.filter((book: Book) => {
          if (book.dueDate && book.borrowedDate) {
            const dueDate = new Date(book.dueDate);
            return dueDate < currentDate && book.available === false;
          }
          return false;
        })
      )
    ).subscribe({
      next: (delayed: Book[]) => {
        this.delayedBooks = delayed;
      },
      error: () => {
        console.error('فشل في تحميل الكتب المتأخرة.');
      }
    });
  }
}

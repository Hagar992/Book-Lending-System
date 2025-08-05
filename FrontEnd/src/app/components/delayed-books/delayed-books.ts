import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // استيراد CommonModule
import { BookService } from '../../services/book'; // غيري المسار حسب هيكل المشروع
import { Book } from '../../models/book.model'; // غيري المسار حسب هيكل المشروع

@Component({
  selector: 'app-delayed-books',
  templateUrl: './delayed-books.html',
  styleUrls: ['./delayed-books.css'],
  standalone: true, // تأكدي إن الكومبوننت standalone
  imports: [CommonModule] // أضف CommonModule هنا
})
export class DelayedBooks implements OnInit {
  delayedBooks: Book[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadDelayedBooks();
  }

  loadDelayedBooks(): void {
    const allBooks = this.bookService.getBooks(); // افتراض إن فيه دالة getBooks
    const currentDate = new Date(); // التاريخ الحالي
    this.delayedBooks = allBooks.filter(book => {
      if (book.dueDate && book.borrowedDate) {
        const dueDate = new Date(book.dueDate);
        return dueDate < currentDate && book.available === false; // الكتب المتأخرة
      }
      return false;
    });
  }
}
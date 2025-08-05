import { Injectable } from '@angular/core';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly booksKey = 'books';

  constructor() {
    this.initializeBooks();
  }

  /**
   * التأكد من وجود بيانات أولية عند أول تشغيل للتطبيق
   */
  private initializeBooks(): void {
    if (!localStorage.getItem(this.booksKey)) {
      this.resetBooks();
    }
  }

  /**
   * استرجاع جميع الكتب من localStorage
   */
  getBooks(): Book[] {
    return JSON.parse(localStorage.getItem(this.booksKey) || '[]');
  }

  /**
   * إعارة كتاب: تغييره إلى غير متاح
   */
  borrowBook(bookId: number): void {
    const updatedBooks = this.getBooks().map(book =>
      book.id === bookId ? { ...book, available: false } : book
    );
    this.saveBooks(updatedBooks);
  }

  /**
   * إرجاع كتاب: تغييره إلى متاح
   */
  returnBook(bookId: number): void {
    const updatedBooks = this.getBooks().map(book =>
      book.id === bookId ? { ...book, available: true } : book
    );
    this.saveBooks(updatedBooks);
  }

  /**
   * إعادة تعيين قائمة الكتب إلى بيانات وهمية (للاختبار أو التهيئة)
   */
  resetBooks(): void {
    const mockBooks: Book[] = [
      { id: 1, title: 'Clean Code', author: 'Robert C. Martin', available: true, coverUrl: 'https://via.placeholder.com/150' },
      { id: 2, title: 'The Pragmatic Programmer', author: 'Andy Hunt', available: false, coverUrl: 'https://via.placeholder.com/150' },
      { id: 3, title: "You Don't Know JS", author: 'Kyle Simpson', available: true, coverUrl: 'https://via.placeholder.com/150' },
    ];
    this.saveBooks(mockBooks);
  }

  addBook(book: Omit<Book, 'id'>): void {
    const currentBooks = this.getBooks();
    const newBook: Book = {
      ...book,
      id: currentBooks.length > 0 ? Math.max(...currentBooks.map(b => b.id)) + 1 : 1,
      coverUrl: book.coverUrl || '' // تأكيد إن الـ coverUrl هيبقى string أو فارغ
    };
    currentBooks.push(newBook);
    this.saveBooks(currentBooks);
  }

  deleteBook(id: number): void {
    const updatedBooks = this.getBooks().filter(book => book.id !== id);
    this.saveBooks(updatedBooks);
  }

  /**
   * تحديث كتاب موجود
   */
  updateBook(book: Book): void {
    const currentBooks = this.getBooks();
    const index = currentBooks.findIndex((b: Book) => b.id === book.id);
    if (index !== -1) {
      currentBooks[index] = book;
      this.saveBooks(currentBooks);
    }
  }

  /**
   * حفظ الكتب في localStorage
   */
  private saveBooks(books: Book[]): void {
    localStorage.setItem(this.booksKey, JSON.stringify(books));
  }

  getBookById(id: number): Book | undefined {
    return this.getBooks().find(book => book.id === id);
  }
}
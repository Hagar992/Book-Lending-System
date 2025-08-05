import { Component } from '@angular/core';
import { BookService } from '../../../services/book';
import { Book } from '../../../models/book.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-book-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-book-management.html',
  styleUrls: ['./admin-book-management.css']
})
export class AdminBookManagement {
  books: Book[] = [];
  showAddForm: boolean = false;
  searchTerm: string = '';
  filteredBooks: { [key: string]: Book[] } = {};

  newBook: Partial<Book> = {
    title: '',
    author: '',
    available: true,
    coverUrl: '',
    category: ''
  };

  // تعريف الأقسام
  categories = [
    { name: 'Literature' },
    { name: 'Religion' },
    { name: 'Self-Development' },
    { name: 'Biographies' },
    { name: 'History' },
    { name: 'Science' },
    { name: 'Philosophy' }
  ];     

  constructor(private bookService: BookService, private router: Router) { 
    this.initializeFilteredBooks();
    this.loadBooks();
  }

  // دالة تحميل الكتب
  loadBooks(): void {
    const loadedBooks = this.bookService.getBooks();
    this.books = Array.isArray(loadedBooks) ? loadedBooks : [];
    console.log('Loaded books:', this.books);
    this.updateFilteredBooks();
  }

  // دالة تهيئة filteredBooks
  initializeFilteredBooks() {
    this.filteredBooks = {};
    this.categories.forEach(category => {
      this.filteredBooks[category.name] = [];
    });
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  submitNewBook() {
    if (!this.newBook.title || !this.newBook.author || !this.newBook.category) {
      alert('Please fill all required fields (Title, Author, and Category)!');
      return;
    }
    // إضافة ID قبل الإرسال
    const bookToAdd: Book = { ...this.newBook, id: Date.now() } as Book;
    this.bookService.addBook(bookToAdd);
    this.loadBooks(); // تحديث الكتب
    this.updateFilteredBooks(); // تحديث filteredBooks يدويًا
    this.resetForm(); // إغلاق الفورم ومسح البيانات
    console.log('Added book:', bookToAdd);
  }

  resetForm() {
    this.newBook = { title: '', author: '', available: true, coverUrl: '', category: '' };
    this.showAddForm = false; // إغلاق الفورم
  }

  editBook(book: Book) {
    this.router.navigate([`/admin/books/edit/${book.id}`]); 
  }

  deleteBook(id: number) {
    this.bookService.deleteBook(id);
    this.loadBooks();
    this.updateFilteredBooks();
  }

  cancelAdd() {
    this.resetForm();
  }

  searchBooks() {
    if (this.searchTerm) {
      this.categories.forEach(category => {
        this.filteredBooks[category.name] = this.books.filter(book => 
          book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) && book.category === category.name.trim()
        );
      });
    } else {
      this.updateFilteredBooks();
    }
  }

  updateFilteredBooks() {
    this.categories.forEach(category => {
      this.filteredBooks[category.name] = this.books.filter(book => book.category === category.name.trim());
    });
  }
}
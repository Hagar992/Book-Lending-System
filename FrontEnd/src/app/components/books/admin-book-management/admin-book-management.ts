import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../../services/book';
import { Book } from '../../../models/book.model';

@Component({
  selector: 'app-admin-book-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe
  ],
  templateUrl: './admin-book-management.html',
  styleUrls: ['./admin-book-management.css']
})
export class AdminBookManagement implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  uniqueCategories: string[] = []; // قائمة الفئات الفريدة فقط نصوص
  booksByCategory: { [category: string]: Book[] } = {};

  searchTerm: string = '';
  showAddForm: boolean = false;
  editingBook: Book | null = null;

  newBook: Book = {
    id: 0,
    title: '',
    author: '',
    available: true,
    coverUrl: '',
    category: '',
    publishedDate: ''
  };

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe(
      (data) => {
        this.books = data;
        this.filteredBooks = data;
        this.updateUniqueCategoriesAndBooksByCategory();
      },
      (error) => console.error('Error loading books:', error)
    );
  }

  updateUniqueCategoriesAndBooksByCategory(): void {
    // فلترة الفئات للتأكد من أنها ليست undefined أو فارغة
    this.uniqueCategories = Array.from(new Set(
      this.filteredBooks
        .map(b => b.category)
        .filter((c): c is string => !!c && c.trim().length > 0)
    ));

    // تجميع الكتب حسب الفئة
    this.booksByCategory = {};
    for (const book of this.filteredBooks) {
      if (book.category && book.category.trim().length > 0) {
        if (!this.booksByCategory[book.category]) {
          this.booksByCategory[book.category] = [];
        }
        this.booksByCategory[book.category].push(book);
      }
    }
  }

  onSearchTermChange(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredBooks = this.books.filter(book =>
      book.title.toLowerCase().includes(term)
    );
    this.updateUniqueCategoriesAndBooksByCategory();
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    this.editingBook = null;
  }

  cancelAdd(): void {
    this.showAddForm = false;
    this.editingBook = null;
    this.newBook = {
      id: 0,
      title: '',
      author: '',
      available: true,
      coverUrl: '',
      category: '',
      publishedDate: ''
    };
  }

  addBook(): void {
    if (!this.newBook.title || !this.newBook.author || !this.newBook.category || !this.newBook.publishedDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (this.editingBook) {
      // تحديث كتاب موجود
      this.bookService.updateBook(this.newBook).subscribe(
        (updatedBook) => {
          const index = this.books.findIndex(b => b.id === updatedBook.id);
          if (index !== -1) {
            this.books[index] = updatedBook;
          }
          this.onSearchTermChange();
          this.cancelAdd();
        },
        (error) => console.error('Error updating book:', error)
      );
    } else {
      // إضافة كتاب جديد
      this.bookService.addBook(this.newBook).subscribe(
        (book) => {
          this.books.push(book);
          this.onSearchTermChange();
          this.cancelAdd();
        },
        (error) => console.error('Error adding book:', error)
      );
    }
  }

  editBook(book: Book): void {
    this.newBook = { ...book };
    this.editingBook = book;
    this.showAddForm = true;
  }

  deleteBook(id: number): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id).subscribe(
        () => {
          this.books = this.books.filter(b => b.id !== id);
          this.onSearchTermChange();
        },
        (error) => console.error('Error deleting book:', error)
      );
    }
  }
}

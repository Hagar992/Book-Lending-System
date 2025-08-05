import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../services/book';
import { AuthService } from '../../../services/auth';
import { Book } from '../../../models/book.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-list.html',
  styleUrls: ['./book-list.css']
})
export class BookList implements OnInit {
  books: Book[] = [];
  loading = true;
  selectedCategory: string = '';
  filteredBooks: Book[] = [];
  searchTerm: string = '';

  categories = [
    { name: 'Literature ' },
    { name: 'Religion ' },
    { name: 'Self-Development' },
    { name: 'Biographies' },
    { name: 'History' },
    { name: ' Science' },
    { name: 'Philosophy' }
    
  ];  

  constructor(
    private bookService: BookService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/books']); // رجوع الأدمن لصفحة الأدمن
      return; // توقف التنفيذ لو أدمن
    }
    this.loadBooks();
  }

  loadBooks(): void {
    this.books = this.bookService.getBooks();
    this.loading = false;
    this.filterByCategory();
  }

  viewDetails(book: Book): void {
    this.router.navigate(['/books', book.id]);
  }

  filterByCategory() {
    this.filteredBooks = this.books.filter(book => {
      const matchesCategory = !this.selectedCategory || book.category === this.selectedCategory;
      const matchesSearch = !this.searchTerm || book.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }
}
import { Route } from '@angular/router';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { AuthGuard } from './guards/auth-guard';
import { BookList } from './components/books/book-list/book-list';
import { AdminBookManagement } from './components/books/admin-book-management/admin-book-management';
import { BookDetails} from './components/books/book-details/book-details'; // أضيفي دي
import { Dashboard } from './pages/dashboard/dashboard';
import { UserBorrowedBooks } from './components/user-borrowed-books/user-borrowed-books';
import { AdminBorrowedBooks } from './components/admin-borrowed-books/admin-borrowed-books';
import { DelayedBooks } from './components/delayed-books/delayed-books'; // غيري المسار حسب هيكل المشروع


export const routes: Route[] = [
  { path: 'login', component: Login },
  { path: 'register', component: Register ,},
  { path: 'books', component: BookList, canActivate: [AuthGuard] },
  { path: 'admin/books', component: AdminBookManagement, canActivate: [AuthGuard] },
  { path: 'admin/books/edit/:id', component: BookDetails, canActivate: [AuthGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'books/:id', component: BookDetails, canActivate: [AuthGuard] },
  { path: 'user/borrowed-books', component: UserBorrowedBooks },
  {path: 'delayed-books', component: DelayedBooks},
  { path: 'admin/borrowed-books', component: AdminBorrowedBooks },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];


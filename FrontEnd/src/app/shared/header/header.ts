import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // أضفنا RouterModule

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule], // أضفنا RouterModule
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  constructor(public authService: AuthService, private router: Router) {}

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToBooks() {
    this.router.navigate(['/books']);
  }

  goToAdminBooks() {
    this.router.navigate(['/admin/books']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // دوال إضافية لو عايزة (اختيارية)
  goToUserBorrowedBooks() {
    this.router.navigate(['/user/borrowed-books']);
  }

  goToAdminBorrowedBooks() {
    this.router.navigate(['/admin/borrowed-books']);
  }
}
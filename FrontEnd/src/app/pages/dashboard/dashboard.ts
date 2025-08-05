import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth'; // استيراد الخدمة

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'] // تأكد من استخدام styleUrls وليس styleUrl
})
export class Dashboard {
  userName: string = 'User'; // القيمة الافتراضية
  userRole: string = 'Member';

  constructor(private router: Router, public authService: AuthService) {
    // جلب بيانات المستخدم من localStorage أو الخدمة
    const storedUser = this.authService.getCurrentUser(); // أو استخدم this.authService.getUser().subscribe(...)
    
    if (storedUser && storedUser.name) {
      this.userName = storedUser.name;
      this.userRole = storedUser.role || 'Member';
    } else {
      this.userName = 'User';
    }
  }

  logout() {
    this.authService.logout(); // مسح البيانات من localStorage
    this.router.navigate(['/login']);
  }

  goToBooks() {
    this.router.navigate(['/books']);
  }

  goToAdminBooks() {
    this.router.navigate(['/admin/books']);
  }

  goToDelayedBooks() {
    // إضافة تحذير قبل التوجيه
    if (confirm('⚠️ Some late books need to be returned! Do you want to follow? ')) {
      this.router.navigate(['/delayed-books']);
    }
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html', // تأكد أن الامتداد .html
  styleUrls: ['./register.css']
})
export class Register {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = 'Member';
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;
  passwordMismatch: boolean = false;

  onRegister() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.passwordMismatch = false;

    // التحقق من الحقول الفارغة
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill out all fields.';
      this.loading = false;
      return;
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      this.loading = false;
      return;
    }

    // التحقق من طول الباسوورد
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      this.loading = false;
      return;
    }

    // التحقق من تطابق الباسوورد
    if (this.password !== this.confirmPassword) {
      this.passwordMismatch = true;
      this.errorMessage = 'Passwords do not match.';
      this.loading = false;
      return;
    }

    // التحقق من وجود المستخدم مسبقًا
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some((u: any) => u.email === this.email);

    if (userExists) {
      this.errorMessage = 'This email is already registered. Please use another one.';
      this.loading = false;
      return;
    }

    // إنشاء مستخدم جديد
    const newUser = {
      name: this.name,
      email: this.email,
      password: this.password, // ⚠️ في بيئة حقيقية: استخدم تشفير (مثل bcrypt)
      role: this.role
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // نجاح التسجيل
    this.successMessage = 'Registration successful! Redirecting to login...';
    this.loading = false;

    // إعادة التوجيه إلى صفحة تسجيل الدخول
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  }

  // يمكنك لاحقًا إضافة دالة للتسجيل عبر Google
  onGoogleRegister() {
    alert('Google registration coming soon!');
  }

  // دالة للانتقال لصفحة تسجيل الدخول
  goToLogin() {
    window.location.href = '/login';
  }
}
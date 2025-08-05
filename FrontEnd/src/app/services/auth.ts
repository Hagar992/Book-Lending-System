import { Injectable } from '@angular/core';

export interface User {
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'Member';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserKey = 'currentUser';
  private usersKey = 'users';
  private tokenKey = 'auth_token';

  // === Authentication Methods ===

  // تسجيل الدخول + تخزين التوكن والمستخدم
  login(email: string, password: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      this.setCurrentUser(user);
      this.setToken(this.generateFakeToken(user));
      return true;
    }
    return false;
  }

  // تسجيل مستخدم جديد
  register(newUser: User): boolean {
    const users = this.getUsers();
    const exists = users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase());
    if (exists) return false;

    users.push(newUser);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    return true;
  }

  // تسجيل الخروج
  logout(): void {
    localStorage.removeItem(this.currentUserKey);
    localStorage.removeItem(this.tokenKey);
  }

  // التحقق من تسجيل الدخول
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    // تحقق من انتهاء التوكن (اختياري)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // تحويل لـ milliseconds
    return exp > Date.now();
  }

  // التحقق من كون المستخدم Admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return !!user && user.role === 'Admin';
  }

  // === User & Token Methods ===

  // الحصول على المستخدم الحالي
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.currentUserKey);
    try {
      return userStr ? JSON.parse(userStr) as User : null;
    } catch {
      return null;
    }
  }

  // إضافة التوكن
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // جلب التوكن
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // محاكاة إنشاء توكن JWT
  private generateFakeToken(user: User): string {
    const payload = {
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // انتهاء بعد ساعة
    };
    // تحسين: استخدام كائن للتوقيع بدل btoa لوحده
    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    return `${encodedHeader}.${encodedPayload}.`; // توكن مزيف بدون توقيع حقيقي
  }

  // الحصول على كل المستخدمين
  getUsers(): User[] {
    const data = localStorage.getItem(this.usersKey);
    try {
      return data ? JSON.parse(data) as User[] : [];
    } catch {
      return [];
    }
  }

  // تخزين المستخدم الحالي
  private setCurrentUser(user: User): void {
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
  }
}
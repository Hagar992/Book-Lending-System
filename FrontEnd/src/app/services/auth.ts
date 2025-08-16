import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface User {
  name: string;
  email: string;
  role: 'Admin' | 'Member';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiBaseUrl;
  private currentUserKey = 'currentUser';
  private tokenKey = 'auth_token';
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {
    this.currentUserSubject.next(this.getCurrentUser());
  }

  login(usernameOrEmail: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { username: usernameOrEmail, password }).pipe(
      tap((response: any) => {
        if (response?.token) {
          this.setToken(response.token);
          this.setCurrentUser({
            name: response.name || usernameOrEmail,
            email: response.email || usernameOrEmail,
            role: response.role || 'Member'
          });
          this.currentUserSubject.next(this.getCurrentUser());
        }
      }),
      catchError((err) => {
        console.error('Login error:', err);
        throw err; // إرسال الخطأ للكومبوننت
      })
    );
  }

  register(data: RegisterDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data).pipe(
      catchError((err) => {
        console.error('Register error:', err);
        throw err;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.currentUserKey);
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return exp > Date.now();
    } catch (err) {
      console.error('Token parse error:', err);
      return false;
    }
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return !!user && user.role === 'Admin';
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.currentUserKey);
    try {
      return userStr ? JSON.parse(userStr) as User : null;
    } catch (err) {
      console.error('User parse error:', err);
      return null;
    }
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
  }

  getCurrentUserObservable(): BehaviorSubject<User | null> {
    return this.currentUserSubject;
  }
}

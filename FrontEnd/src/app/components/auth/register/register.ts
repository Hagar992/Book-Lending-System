import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role: ['Member']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;

      const formValues = this.registerForm.value;
      const registerData = {
        username: formValues.name.trim(),
        email: formValues.email.trim(),
        password: formValues.password,
        role: formValues.role 
      };

      console.log('📤 Sending data to API:', registerData);

      this.http.post(`${environment.apiBaseUrl}/Auth/register`, registerData, {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'json'
      }).subscribe({
        next: (response: any) => {
          console.log('✅ Register Response:', response);

          if (typeof response === 'string') {
            this.successMessage = response;
          } else if (response?.message) {
            this.successMessage = response.message;
          } else {
            this.successMessage = 'Registration successful!';
          }

          this.errorMessage = '';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ Registration error:', error);

          if (error.error) {
            if (typeof error.error === 'string') {
              this.errorMessage = error.error;
            } else if (error.error.message) {
              this.errorMessage = error.error.message;
            } else if (Array.isArray(error.error.errors)) {
              this.errorMessage = error.error.errors.join(', ');
            } else {
              this.errorMessage = JSON.stringify(error.error);
            }
          } else {
            this.errorMessage = '❌ Registration failed. Please check your input.';
          }

          this.loading = false;
        }
      });
    } else {
      this.errorMessage = '⚠ Please fill out the form correctly.';
    }
  }

  onGoogleRegister(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    alert('Google registration coming soon!');
    this.loading = false;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}

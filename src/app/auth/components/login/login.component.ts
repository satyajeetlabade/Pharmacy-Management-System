import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../../shared/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;
  isSubmitting: boolean = false;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
  this.loginError = null;

  if (this.loginForm.valid) {
    this.isSubmitting = true;

    this.service.loginUser(this.loginForm.value).subscribe({
      next: (response) => {
        this.service.loginSuccess(response.token, {
          userId: response.userId,
          name: response.name,
          role: response.role,
          email: response.email
        });

        this.toast.success('Login Successful!');

        switch (response.role) {
          case 'Admin':
            this.router.navigate(['/orders']);
            break;
          case 'Doctor':
            this.router.navigate(['/drugs']);
            break;
          default:
            this.router.navigate(['/']);
            break;
        }
      },
      error: (error) => {
        this.loginError = error.error?.message || 'Invalid credentials';
        this.toast.error('Something went wrong!');
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}


  
}

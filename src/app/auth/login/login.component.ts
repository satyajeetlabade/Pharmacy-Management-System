import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.loginError = null;

    if (this.loginForm.valid) {
      this.service.loginUser(this.loginForm.value).subscribe({
        next: (response) => {
          console.log(response);
          alert('Login successful');
          this.router.navigate(['/drugs']);
        },
        error: (error) => {
          this.loginError = error.error?.message || 'Invalid credentials';
        }
      });
    }
  }
}

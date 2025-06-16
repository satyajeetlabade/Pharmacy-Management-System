import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserRole } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isSubmitting = false;
  registerError: string | null = null;

  roles = Object.keys(UserRole).map(key => ({
    key,
    value: UserRole[key as keyof typeof UserRole]
  }));

  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
      ]],
      contact: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      role: ['', Validators.required]
    });
  }

  get password() {
    return this.registerForm.get('password');
  }

  onSubmit() {
    this.registerError = null;
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      this.service.registerUser(this.registerForm.value).subscribe({
        next: () => {
          this.toastr.success('Registration successful! Please log in.', 'Success');
          this.registerForm.reset();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.toastr.error(error.error?.message || 'Registration failed', 'Error');
          this.registerError = error.error?.message || 'Server error occurred during registration';
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  }
}

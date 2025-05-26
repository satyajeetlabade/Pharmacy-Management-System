import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UserRole } from '../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [ReactiveFormsModule, CommonModule, FormsModule]
})
export class RegisterComponent {
  registerForm: FormGroup;

  userRole = Object.keys(UserRole).filter(key => isNaN(Number(key)))
  .map(key => ({
    key,
    value: UserRole[key as keyof typeof UserRole]
  }));

  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private router: Router
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
      userRole: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.service.registerUser(this.registerForm.value).subscribe({
        next: (response) => {
          alert("User Registered Successfully");
          this.registerForm.reset();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          alert(`Registration failed: ${error.error?.message || 'Server error'}`);
        }
      });
    }
  }
}

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';
import { UserRole } from '../../models/user.model';

describe('RegisterComponent', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;
  let mockAuthService: any;
  let mockToastr: any;
  let router: Router;

  beforeEach(async () => {
    mockAuthService = {
      registerUser: jasmine.createSpy('registerUser')
    };

    mockToastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error')
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule, CommonModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ToastrService, useValue: mockToastr },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    const form = component.registerForm;
    expect(form).toBeDefined();
    expect(form.valid).toBeFalse();
    expect(form.get('name')?.value).toBe('');
  });

  it('should mark the form as invalid with incorrect data', () => {
    component.registerForm.setValue({
      name: 'A',
      email: 'bad-email',
      password: 'pass',
      contact: '123',
      role: ''
    });
    expect(component.registerForm.valid).toBeFalse();
  });

  it('should submit the form when valid and navigate to login', fakeAsync(() => {
    const navigateSpy = spyOn(router, 'navigate');
    mockAuthService.registerUser.and.returnValue(of({ success: true }));

    component.registerForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password@123',
      contact: '9876543210',
      role: UserRole.Admin
    });

    component.onSubmit();
    tick();

    expect(component.isSubmitting).toBeFalse();
    expect(mockAuthService.registerUser).toHaveBeenCalled();
    expect(mockToastr.success).toHaveBeenCalledWith(
      'Registration successful! Please log in.',
      'Success'
    );
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  }));

  it('should handle registration error and display toastr message', fakeAsync(() => {
    mockAuthService.registerUser.and.returnValue(throwError({
      error: { message: 'User already exists' }
    }));

    component.registerForm.setValue({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'Password@123',
      contact: '9876543210',
      role: UserRole.Admin
    });

    component.onSubmit();
    tick();

    expect(component.registerError).toBe('User already exists');
    expect(component.isSubmitting).toBeFalse();
    expect(mockToastr.error).toHaveBeenCalledWith('User already exists', 'Error');
  }));
});

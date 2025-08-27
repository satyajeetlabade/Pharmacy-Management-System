import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../../shared/toast.service';
import { Router, provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';

describe('LoginComponent (Angular 17 - provideRouter)', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let authServiceMock: any;
  let toastServiceMock: any;
  let router: Router;

  beforeEach(async () => {
    authServiceMock = {
      loginUser: jasmine.createSpy('loginUser'),
      loginSuccess: jasmine.createSpy('loginSuccess')
    };

    toastServiceMock = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error')
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, CommonModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should login and redirect admin to /orders', fakeAsync(() => {
    const navigateSpy = spyOn(router, 'navigate');
    const response = {
      token: 'mock-token',
      userId: 'u1',
      name: 'Admin User',
      role: 'Admin',
      email: 'admin@example.com'
    };

    authServiceMock.loginUser.and.returnValue(of(response));

    component.loginForm.setValue({
      email: 'admin@example.com',
      password: 'Password@123'
    });

    component.onSubmit();
    tick();

    expect(authServiceMock.loginUser).toHaveBeenCalledWith(component.loginForm.value);
    expect(authServiceMock.loginSuccess).toHaveBeenCalledWith(response.token, {
      userId: response.userId,
      name: response.name,
      role: response.role,
      email: response.email
    });

    expect(toastServiceMock.success).toHaveBeenCalledWith('Login Successful!');
    expect(navigateSpy).toHaveBeenCalledWith(['/orders']);
  }));

  it('should login and redirect doctor to /drugs', fakeAsync(() => {
    const navigateSpy = spyOn(router, 'navigate');
    const response = {
      token: 'mock-token',
      userId: 'u2',
      name: 'Dr. Who',
      role: 'Doctor',
      email: 'doctor@example.com'
    };

    authServiceMock.loginUser.and.returnValue(of(response));

    component.loginForm.setValue({
      email: 'doctor@example.com',
      password: 'Password@123'
    });

    component.onSubmit();
    tick();

    expect(navigateSpy).toHaveBeenCalledWith(['/drugs']);
  }));

  it('should handle login error and show toast', fakeAsync(() => {
    const errorResponse = {
      error: { message: 'Invalid credentials' }
    };

    authServiceMock.loginUser.and.returnValue(throwError(errorResponse));

    component.loginForm.setValue({
      email: 'bad@example.com',
      password: 'wrongpass'
    });

    component.onSubmit();
    tick();

    expect(component.loginError).toBe('Invalid credentials');
    expect(component.isSubmitting).toBeFalse();
    expect(toastServiceMock.error).toHaveBeenCalledWith('Something went wrong!');
  }));
});

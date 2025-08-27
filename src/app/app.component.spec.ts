import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './auth/services/auth.service';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { FooterComponent } from './shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

describe('AppComponent (Angular 17 - provideRouter)', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let authServiceMock: any;
  let router: Router;

  beforeEach(async () => {
    // Mock AuthService
    authServiceMock = {
      isLoggedIn$: of(true),
      userRole$: of('admin'),
      logout: jasmine.createSpy('logout')
    };

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        CommonModule,
        FooterComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        provideRouter([])  // No routes needed for this test
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login state and role correctly', () => {
    expect(component.isLoggedIn).toBeTrue();
    expect(component.userRole).toBe('admin');
  });

  it('should return true if router url is in hidden routes', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/login');
    expect(component.hideFooter()).toBeTrue();
  });

  it('should return false if router url is not in hidden routes', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/dashboard');
    expect(component.hideFooter()).toBeFalse();
  });

  it('should logout and navigate to login page', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.logout();
    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(component.isLoggedIn).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});

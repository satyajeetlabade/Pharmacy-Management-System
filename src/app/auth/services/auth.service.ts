import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl: string = '/api/auth';

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  private userRoleSubject = new BehaviorSubject<string | null>(this.getUser()?.role || null);

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  userRole$ = this.userRoleSubject.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  loginUser(user: User): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, user);
  }

  registerUser(user: User): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, user);
  }

  loginSuccess(token: string, user: any): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.isLoggedInSubject.next(true);
    this.userRoleSubject.next(user.role);
  }
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.isLoggedInSubject.next(false);
    this.userRoleSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserRole(): string | null {
    return this.getUser()?.role || null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  
}

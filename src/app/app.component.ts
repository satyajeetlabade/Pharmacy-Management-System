import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, FooterComponent,],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'Pharmacy-Management-System';
  userRole: string | null = null;
  isLoggedIn = false;
  currentYear: number = new Date().getFullYear();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
     this.authService.isLoggedIn$.subscribe((loggedIn) => {
    this.isLoggedIn = loggedIn;
  });

  this.authService.userRole$.subscribe((role) => {
    this.userRole = role;
  });
  }
  hideFooter(): boolean {
    const hiddenRoutes = ['/login', '/register',['/welcome']];
    return hiddenRoutes.includes(this.router.url);
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}

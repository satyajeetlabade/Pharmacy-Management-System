import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivate
} from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const expectedRole = route.data['expectedRole'];
    
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const userRole = this.authService.getUserRole();

    if (expectedRole instanceof Array) {
      if (!expectedRole.includes(userRole)) {
        this.router.navigate(['/unauthorized']);
        return false;
      }
    } else {
      if (userRole !== expectedRole) {
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }

    return true;


    
  }
}

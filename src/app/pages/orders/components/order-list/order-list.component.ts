  import { Component, NgModule, OnInit } from '@angular/core';
 
  import { CommonModule, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { devOnlyGuardedExpression } from '@angular/compiler';
import { AuthService } from '../../../../auth/services/auth.service';
import { OrderResponseDto } from '../../models/orders.model';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../../../shared/toast.service';

  @Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
    standalone: true,
    imports: [CommonModule, RouterModule]
  })
  export class OrderListComponent implements OnInit {
  orders: OrderResponseDto[] = [];
  loading = false;
  error = '';
  userId!: number;
  isDoctor: boolean = false;

  constructor(private orderService: OrderService, private router: Router, private authService: AuthService, private toastr : ToastService) {}

  ngOnInit(): void {
    const userRole = this.authService.getUserRole();
    if(userRole == 'Doctor')
        this.isDoctor = true;
    this.loadOrders();

  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getAll().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load orders';
        this.loading = false;
      }
    });
  }

  onVerify(orderId: number): void {
    const userData = localStorage.getItem('user');
    if(userData){
      const user = JSON.parse(userData);
      this.userId = user.userId;

    }
    this.orderService.verifyOrder(orderId, { verifiedByAdminId: this.userId }).subscribe({
      next: () => {
        this.toastr.success('Order verified successfully');
        this.loadOrders();
      },
      error: () => this.toastr.error('Failed to verify order'),
    });
  }

  onPickup(orderId: number): void {
    const pickedUpAt = new Date().toISOString();
    this.orderService.markAsPickedUp(orderId, { pickedUpAt }).subscribe({
      next: () => {
        this.toastr.success('Order marked as picked up successfully');
        this.loadOrders();
      },
      error: (error) => this.toastr.error('Failed to mark order as picked up', error.message),
    });
  }

  goToDetails(orderId: number): void {
  this.router.navigate(['/orders/details', orderId]);
}
}

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OrderListComponent } from './order-list.component';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { ToastService } from '../../../../shared/toast.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('OrderListComponent', () => {
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;
  let orderServiceMock: any;
  let authServiceMock: any;
  let toastServiceMock: any;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    orderServiceMock = {
      getAll: jasmine.createSpy('getAll'),
      verifyOrder: jasmine.createSpy('verifyOrder'),
      markAsPickedUp: jasmine.createSpy('markAsPickedUp')
    };

    authServiceMock = {
      getUserRole: jasmine.createSpy('getUserRole').and.returnValue('Admin')
    };

    toastServiceMock = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error')
    };

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [OrderListComponent],
      providers: [
        { provide: OrderService, useValue: orderServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
        { provide: Router, useValue: routerSpy },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
  });

  it('should create component and initialize with Admin role', () => {
    expect(component).toBeTruthy();
    expect(authServiceMock.getUserRole).toHaveBeenCalled();
    expect(component.isDoctor).toBeFalse();
  });

  it('should load orders successfully', fakeAsync(() => {
    const mockOrders = [
      { id: 1, drugName: 'Test Drug', quantity: 1 } as any
    ];
    orderServiceMock.getAll.and.returnValue(of(mockOrders));

    component.ngOnInit();
    tick();

    expect(orderServiceMock.getAll).toHaveBeenCalled();
    expect(component.orders.length).toBe(1);
    expect(component.loading).toBeFalse();
  }));

  it('should handle order load failure', fakeAsync(() => {
    orderServiceMock.getAll.and.returnValue(throwError(() => new Error('Failed')));

    component.ngOnInit();
    tick();

    expect(component.error).toBe('Failed to load orders');
    expect(component.loading).toBeFalse();
  }));

  it('should verify order and reload list', fakeAsync(() => {
    const orderId = 42;
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ userId: 5 }));
    orderServiceMock.verifyOrder.and.returnValue(of({}));
    orderServiceMock.getAll.and.returnValue(of([]));

    component.onVerify(orderId);
    tick();

    expect(orderServiceMock.verifyOrder).toHaveBeenCalledWith(orderId, { verifiedByAdminId: 5 });
    expect(toastServiceMock.success).toHaveBeenCalledWith('Order verified successfully');
  }));

  it('should show error if verifyOrder fails', fakeAsync(() => {
    const orderId = 999;
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ userId: 1 }));
    orderServiceMock.verifyOrder.and.returnValue(throwError(() => new Error('Bad Request')));

    component.onVerify(orderId);
    tick();

    expect(toastServiceMock.error).toHaveBeenCalledWith('Failed to verify order');
  }));

  it('should mark order as picked up', fakeAsync(() => {
    const orderId = 10;
    orderServiceMock.markAsPickedUp.and.returnValue(of({}));
    orderServiceMock.getAll.and.returnValue(of([]));

    component.onPickup(orderId);
    tick();

    expect(orderServiceMock.markAsPickedUp).toHaveBeenCalled();
    expect(toastServiceMock.success).toHaveBeenCalledWith('Order marked as picked up successfully');
  }));

  it('should handle pickup error', fakeAsync(() => {
    const orderId = 11;
    orderServiceMock.markAsPickedUp.and.returnValue(throwError(() => new Error('Network Error')));

    component.onPickup(orderId);
    tick();

    expect(toastServiceMock.error).toHaveBeenCalledWith('Failed to mark order as picked up', 'Network Error');
  }));

  it('should navigate to order details', () => {
    component.goToDetails(1001);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/orders/details', 1001]);
  });
});

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { OrderDetailsComponent } from './order-details.component';
import { OrderService } from '../../services/order.service';
import { OrderResponseDto } from '../../models/orders.model';
import { provideHttpClient } from '@angular/common/http';

describe('OrderDetailsComponent', () => {
  let component: OrderDetailsComponent;
  let fixture: ComponentFixture<OrderDetailsComponent>;
  let mockOrderService: jasmine.SpyObj<OrderService>;

  beforeEach(async () => {
    mockOrderService = jasmine.createSpyObj('OrderService', ['getById']);

    await TestBed.configureTestingModule({
      imports: [OrderDetailsComponent],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1'
              }
            }
          }
        },
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and set order details correctly', fakeAsync(() => {
    const mockOrder: OrderResponseDto = {
      id: 1,
      status: 'Verified',
      orderDate: '2025-07-30T12:00:00.000Z',
      doctorName: 'Dr. Satyajeet',
      verifiedBy: 'Admin1',
      verifiedAt: '2025-07-30T12:10:00.000Z',
      pickedUpAt: '2025-07-30T13:00:00.000Z',
      totalAmount: 150.0,
      items: [
        { drugName: 'Amoxicillin', quantity: 2, unitPrice: 50 },
        { drugName: 'Ibuprofen', quantity: 1, unitPrice: 50 }
      ]
    };

    mockOrderService.getById.and.returnValue(of(mockOrder));
    component.ngOnInit();
    tick();

    expect(component.orderId).toBe(1);
    expect(mockOrderService.getById).toHaveBeenCalledWith(1);
    expect(component.order).toEqual(mockOrder);
    expect(component.error).toBe('');
    expect(component.loading).toBeFalse();
  }));

  it('should set error message on API failure', fakeAsync(() => {
    mockOrderService.getById.and.returnValue(throwError(() => new Error('Service down')));
    component.ngOnInit();
    tick();

    expect(component.order).toBeUndefined();
    expect(component.error).toBe('Failed to load order details');
    expect(component.loading).toBeFalse();
  }));

  it('should not attempt to fetch if orderId is invalid', () => {
    const invalidRoute = {
      snapshot: {
        paramMap: {
          get: (key: string) => null
        }
      }
    };

    TestBed.overrideProvider(ActivatedRoute, { useValue: invalidRoute });
    fixture = TestBed.createComponent(OrderDetailsComponent);
    component = fixture.componentInstance;

    component.ngOnInit();
    expect(component.orderId).toBeNaN();
    expect(mockOrderService.getById).not.toHaveBeenCalled();
  });
});

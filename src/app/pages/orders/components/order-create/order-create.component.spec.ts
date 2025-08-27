import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OrderCreateComponent } from './order-create.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DrugService } from '../../../drugs/services/drug.service';
import { OrderService } from '../../services/order.service';
import { ToastrService } from 'ngx-toastr';
import { Drug, DrugType } from '../../../drugs/models/drug.model';
import { CommonModule } from '@angular/common';

describe('OrderCreateComponent', () => {
  let component: OrderCreateComponent;
  let fixture: ComponentFixture<OrderCreateComponent>;
  let mockDrugService: jasmine.SpyObj<DrugService>;
  let mockOrderService: jasmine.SpyObj<OrderService>;
  let mockToastr: jasmine.SpyObj<ToastrService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockDrugs: Drug[] = [
    { id: 1, name: 'Paracetamol', quantityInStock: 100, price: 20, drugType: DrugType.Tablet, expiryDate: new Date('2025-12-31') },
    { id: 2, name: 'Ibuprofen', quantityInStock: 200, price: 15,drugType: DrugType.Tablet, expiryDate: new Date('2025-12-31')}
  ];

  beforeEach(async () => {
    mockDrugService = jasmine.createSpyObj('DrugService', ['getAll']);
    mockOrderService = jasmine.createSpyObj('OrderService', ['create']);
    mockToastr = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [OrderCreateComponent, ReactiveFormsModule, CommonModule],
      providers: [
        FormBuilder,
        { provide: DrugService, useValue: mockDrugService },
        { provide: OrderService, useValue: mockOrderService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    // Setup localStorage mock
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ userId: 99, name: 'Dr. Satyajeet' }));

    fixture = TestBed.createComponent(OrderCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load doctor details from localStorage', () => {
    expect(component.doctorId).toBe(99);
    expect(component.doctorName).toBe('Dr. Satyajeet');
  });

  it('should initialize the form correctly', () => {
    expect(component.orderForm).toBeDefined();
    expect(component.items.length).toBe(1);
  });

  it('should add and remove order items dynamically', () => {
    component.addItem();
    expect(component.items.length).toBe(2);

    component.removeItem(1);
    expect(component.items.length).toBe(1);
  });

  it('should load drugs from the service', () => {
    mockDrugService.getAll.and.returnValue(of(mockDrugs));
    component.loadDrugs();
    expect(mockDrugService.getAll).toHaveBeenCalled();
  });

  it('should not submit invalid form and show error', () => {
    component.orderForm.patchValue({ doctorId: null });
    component.submitOrder();
    expect(mockToastr.error).toHaveBeenCalledWith('Please fill all required fields correctly');
    expect(mockOrderService.create).not.toHaveBeenCalled();
  });

  it('should submit form successfully', fakeAsync(() => {
    mockDrugService.getAll.and.returnValue(of(mockDrugs));
    mockOrderService.create.and.returnValue(of({}));

    component.orderForm.patchValue({ doctorId: 99 });
    component.items.at(0).patchValue({ drugId: 1, quantity: 2 });

    component.submitOrder();
    tick();

    expect(mockOrderService.create).toHaveBeenCalledWith(component.orderForm.value);
    expect(mockToastr.success).toHaveBeenCalledWith('Order placed successfully');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/orders']);
  }));

  it('should handle order submission failure', fakeAsync(() => {
    mockOrderService.create.and.returnValue(throwError(() => new Error('API error')));

    component.orderForm.patchValue({ doctorId: 99 });
    component.items.at(0).patchValue({ drugId: 1, quantity: 2 });

    component.submitOrder();
    tick();

    expect(mockToastr.error).toHaveBeenCalledWith('Failed to place order');
    expect(component.loading).toBeFalse();
  }));
});

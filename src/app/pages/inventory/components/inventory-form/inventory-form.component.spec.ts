import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryFormComponent } from './inventory-form.component';
import { InventoryService } from '../../services/inventory.service';
import { DrugService } from '../../../drugs/services/drug.service';
import { SupplierService } from '../../../supplier/services/supplier.service';
import { ToastService } from '../../../../shared/toast.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

describe('InventoryFormComponent', () => {
  let component: InventoryFormComponent;
  let fixture: ComponentFixture<InventoryFormComponent>;

  let mockInventoryService: jasmine.SpyObj<InventoryService>;
  let mockDrugService: jasmine.SpyObj<DrugService>;
  let mockSupplierService: jasmine.SpyObj<SupplierService>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockInventoryService = jasmine.createSpyObj('InventoryService', ['bulkAdd']);
    mockDrugService = jasmine.createSpyObj('DrugService', ['getAll']);
    mockSupplierService = jasmine.createSpyObj('SupplierService', ['getSuppliers']);
    mockToastService = jasmine.createSpyObj('ToastService', ['error', 'success']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [InventoryFormComponent, ReactiveFormsModule],
      providers: [
        { provide: InventoryService, useValue: mockInventoryService },
        { provide: DrugService, useValue: mockDrugService },
        { provide: SupplierService, useValue: mockSupplierService },
        { provide: ToastService, useValue: mockToastService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryFormComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and load drugs/suppliers', () => {
    const mockDrugs = [{ id: 1, name: 'Paracetamol', }];
    const mockSuppliers = [{ id: 1, name: 'ABC Supplier', contactName: 'ABC' }];
    //mockDrugService.getAll.and.returnValue(of(mockDrugs));
    //mockSupplierService.getSuppliers.and.returnValue(of(mockSuppliers));

    fixture.detectChanges();

    expect(component.drugs).toEqual(mockDrugs);
    expect(component.suppliers).toEqual(mockSuppliers);
    expect(component.inventories.length).toBe(1); // One inventory item added
  });

  it('should add and remove inventory items', () => {
    fixture.detectChanges();
    expect(component.inventories.length).toBe(1);

    component.addInventoryItem();
    expect(component.inventories.length).toBe(2);

    component.removeInventoryItem(1);
    expect(component.inventories.length).toBe(1);
  });

  it('should show error if form is invalid on submit', () => {
    fixture.detectChanges();
    component.submit();
    expect(mockToastService.error).toHaveBeenCalledWith('Please fill all required fields correctly.', 'Validation Error');
  });

  it('should call bulkAdd and show success message on valid submit', () => {
    fixture.detectChanges();

    component.form.patchValue({
      supplierId: 1,
      purchaseDate: '2025-07-30'
    });
    component.inventories.at(0).patchValue({
      drugId: 101,
      batchNumber: 'B123',
      quantity: 10
    });

    const mockResponse = [{
      id: 1,
      drugId: 101,
      drugName: 'Paracetamol',
      supplierId: 1,
      supplierName: 'ABC Supplier',
      batchNumber: 'B123',
      quantity: 10,
      purchaseDate: '2025-07-30T00:00:00Z'
    }];

    mockInventoryService.bulkAdd.and.returnValue(of(mockResponse));

    component.submit();

    expect(mockInventoryService.bulkAdd).toHaveBeenCalled();
    expect(mockToastService.success).toHaveBeenCalledWith('Inventory added successfully!', 'Success');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['admin/inventory']);
  });

  it('should handle bulkAdd failure', () => {
    fixture.detectChanges();

    component.form.patchValue({
      supplierId: 1,
      purchaseDate: '2025-07-30'
    });
    component.inventories.at(0).patchValue({
      drugId: 101,
      batchNumber: 'B123',
      quantity: 10
    });

    mockInventoryService.bulkAdd.and.returnValue(throwError(() => new Error('Backend failed')));

    component.submit();

    expect(mockToastService.error).toHaveBeenCalledWith('Error adding inventory: Backend failed', 'Error');
  });
});

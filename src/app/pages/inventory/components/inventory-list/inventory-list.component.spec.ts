import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryComponent } from './inventory-list.component';
import { InventoryService } from '../../services/inventory.service';
import { ToastService } from '../../../../shared/toast.service';
import { of, throwError } from 'rxjs';
import { InventoryResponseDTO } from '../../models/inventory.model';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

describe('InventoryComponent', () => {
  let component: InventoryComponent;
  let fixture: ComponentFixture<InventoryComponent>;
  let mockInventoryService: jasmine.SpyObj<InventoryService>;
  let mockToastService: jasmine.SpyObj<ToastService>;

  const mockInventories: InventoryResponseDTO[] = [
    {
      id: 1,
      drugId: 101,
      drugName: 'Paracetamol',
      supplierId: 201,
      supplierName: 'ABC Pharma',
      batchNumber: 'B1234',
      quantity: 250,
      purchaseDate: '2025-07-25T10:00:00Z'
    },
    {
      id: 2,
      drugId: 102,
      drugName: 'Ciprofloxacin',
      supplierId: 202,
      supplierName: 'XYZ Labs',
      batchNumber: 'B5678',
      quantity: 100,
      purchaseDate: '2025-07-20T15:30:00Z'
    }
  ];

  beforeEach(async () => {
    mockInventoryService = jasmine.createSpyObj('InventoryService', ['getAll']);
    mockToastService = jasmine.createSpyObj('ToastService', ['error']);

    await TestBed.configureTestingModule({
      imports: [InventoryComponent, DatePipe, RouterLink],
      providers: [
        { provide: InventoryService, useValue: mockInventoryService },
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load inventory data on init', () => {
    mockInventoryService.getAll.and.returnValue(of(mockInventories));

    fixture.detectChanges(); // triggers ngOnInit
    expect(mockInventoryService.getAll).toHaveBeenCalled();
    expect(component.inventories.length).toBe(2);
    expect(component.inventories[0].drugName).toBe('Paracetamol');
    expect(component.inventories[1].supplierName).toBe('XYZ Labs');
  });

  it('should handle error during inventory load and show toast', () => {
    const error = new Error('API failure');
    mockInventoryService.getAll.and.returnValue(throwError(() => error));

    fixture.detectChanges();
    expect(mockToastService.error).toHaveBeenCalledWith('Error loading inventory: API failure');
    expect(component.inventories.length).toBe(0);
  });
});

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InventoryResponseDTO } from '../../models/inventory.model';
import { InventoryService } from '../../services/inventory.service';
import { DrugService } from '../../../drugs/services/drug.service';
import { SupplierService } from '../../../supplier/services/supplier.service';
import { ToastService } from '../../../../shared/toast.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inventory-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.css']
})
export class InventoryFormComponent implements OnInit {
  form!: FormGroup;
  drugs: any[] = [];
  suppliers: any[] = [];
  inventoryResponseList: InventoryResponseDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private drugService: DrugService,
    private supplierService: SupplierService,
    private toastr: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDrugs();
    this.loadSuppliers();

    this.form = this.fb.group({
      supplierId: [null, Validators.required],
      purchaseDate: [null, Validators.required],
      inventories: this.fb.array([])
    });

    this.addInventoryItem(); // Add first item
  }

  get inventories(): FormArray {
    return this.form.get('inventories') as FormArray;
  }

  addInventoryItem(): void {
    this.inventories.push(this.fb.group({
      drugId: [null, Validators.required],
      batchNumber: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    }));
  }

  removeInventoryItem(index: number): void {
    this.inventories.removeAt(index);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.error('Please fill all required fields correctly.', 'Validation Error');
      return;
    }

    const formValue = this.form.value;
    const payload = {
      inventories: formValue.inventories.map((item: any) => ({
        ...item,
        supplierId: formValue.supplierId,
        purchaseDate: formValue.purchaseDate
      }))
    };

    this.inventoryService.bulkAdd(payload).subscribe({
      next: (res: InventoryResponseDTO[]) => {
        this.inventoryResponseList = res;
        this.toastr.success('Inventory added successfully!', 'Success');
        this.resetForm();
        this.router.navigate(['admin/inventory']);
      },
      error: err => this.toastr.error('Error adding inventory: ' + err.message, 'Error'),
    });
  }

  resetForm(): void {
    this.form.reset();
    this.inventories.clear();
    this.addInventoryItem();
  }

  loadDrugs() {
    this.drugService.getAll().subscribe(data => this.drugs = data);
  }

  loadSuppliers() {
    this.supplierService.getSuppliers().subscribe(data => this.suppliers = data);
  }
}

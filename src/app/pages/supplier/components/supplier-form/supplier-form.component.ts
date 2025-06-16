import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupplierService } from '../../services/supplier.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../shared/toast.service';
import { Supplier } from '../../models/supplier.model';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterModule],
  templateUrl: './supplier-form.component.html',
  styleUrl: './supplier-form.component.css'
})
export class SupplierFormComponent implements OnInit{
  supplierForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private router: Router,
    private tostr: ToastService
  ){}

  ngOnInit(): void {
      this.supplierForm = this.fb.group({
        name: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        contactNumber: ['', [Validators.maxLength(20)]],
        contactEmail: ['', [Validators.email,Validators.maxLength(150)]],
        address: ['',[Validators.maxLength(300)]]
      });
  }

   onSubmit(): void {
    if (this.supplierForm.valid) {
      const newSupplier: Supplier = this.supplierForm.value;
      this.supplierService.createSupplier(newSupplier).subscribe({
        next: () => { this.tostr.success('Supplier created successfully!');
          this.router.navigate(['admin/suppliers']);
        },
        
        error: (err) => this.tostr.error('Error creating supplier: ' + err.message)
      });
    }


}
}

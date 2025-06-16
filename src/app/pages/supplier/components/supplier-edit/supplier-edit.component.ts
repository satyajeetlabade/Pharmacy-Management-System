import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from '../../services/supplier.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-supplier-edit',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './supplier-edit.component.html',
  styleUrl: './supplier-edit.component.css'
})
export class SupplierEditComponent implements OnInit {

  supplierForm!: FormGroup;
  supplierId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private supplierService: SupplierService,
    private router: Router,
    private toastr: ToastrService
  ){
    this.supplierForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      contactEmail: [''],
      contactNumber: [''],
      address: ['']
    });
  }

  ngOnInit(): void {
      this.supplierId = Number(this.route.snapshot.paramMap.get('id'));
      this.supplierForm.get('id')?.setValue(this.supplierId);
      this.loadSupplier();
  }

  loadSupplier() {
    this.supplierService.getSupplierById(this.supplierId).subscribe(supplier => {
      this.supplierForm.patchValue(supplier);
    });
  }

  onSubmit(){
    if(this.supplierForm.valid){
      this.supplierService.updateSupplier(this.supplierId, this.supplierForm.value).subscribe(() => {
      this.toastr.success('Supplier updated successfully', 'Success');
        this.router.navigate(['admin/suppliers']);
        
      },
    );
    }
  }





}

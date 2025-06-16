import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../services/supplier.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Supplier } from '../../models/supplier.model';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.css'
})
export class SupplierListComponent implements OnInit {
  suppliers: Supplier[]=[];

  constructor(private supplierService: SupplierService, private router: Router){}

  ngOnInit(): void {
      this.loadSuppliers();
  }

  loadSuppliers(){
    this.supplierService.getSuppliers().subscribe(data => this.suppliers = data);
  }

  editSupplier(id: number) {
    this.router.navigate(['admin/supplier/edit', id]);
  }

  deleteSupplier(id: number): void {
  const confirmed = window.confirm('Are you sure you want to delete this supplier?');
  if (confirmed) {
    this.supplierService.deleteSupplier(id).subscribe({
      next: () => {
        this.suppliers = this.suppliers.filter(s => s.id !== id);
        alert("Supplier deleted successfully.")
      },
      error: err => {
        console.error('Delete failed', err);
        alert(err.message);
      }
    });
  }
}

}

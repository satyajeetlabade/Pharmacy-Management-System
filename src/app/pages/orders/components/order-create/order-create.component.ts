import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DrugService } from '../../../drugs/services/drug.service';
import { Drug } from '../../../drugs/models/drug.model';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.css']
})
export class OrderCreateComponent implements OnInit {
  orderForm!: FormGroup;
  drugs: Drug[] = [];
  loading: boolean = false;
  doctorName: string = '';
  doctorId: number = 0;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private drugService: DrugService,
    private router: Router,
    private tostr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getDoctorDetailsFromLocalStorage();
    this.initForm();
    this.loadDrugs();
  }

  getDoctorDetailsFromLocalStorage() {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      console.log(user);
      this.doctorId = user.userId;;
      this.doctorName = user.name;
    } else {
      alert('User not logged in');
      this.router.navigate(['/login']);
    }
  }

  initForm() {
    this.orderForm = this.fb.group({
      doctorId: [this.doctorId, Validators.required],
      items: this.fb.array([
        this.createOrderItem()
      ])
    });
  }

  createOrderItem(): FormGroup {
    return this.fb.group({
      drugId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  addItem() {
    this.items.push(this.createOrderItem());
  }

  removeItem(index: number) {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  loadDrugs() {
    this.drugService.getAll().subscribe({
      next: (data) => { this.drugs = data },
      error: () => alert('Failed to load drugs')
    });
  }

  submitOrder() {
    if (this.orderForm.invalid) {
      this.tostr.error('Please fill all required fields correctly');
      return;
    }

    this.loading = true;

    this.orderService.create(this.orderForm.value).subscribe({
      next: () => {
        this.tostr.success('Order placed successfully');
        this.router.navigate(['/orders']);
      },
      error: () => {
        this.tostr.error('Failed to place order');
        this.loading = false;
      }
    });
  }
}

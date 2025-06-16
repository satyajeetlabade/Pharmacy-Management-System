import { Component, OnInit } from '@angular/core';

import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { InventoryResponseDTO } from '../../models/inventory.model';
import { ToastService } from '../../../../shared/toast.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './inventory-list.component.html',
})
export class InventoryComponent implements OnInit {
  inventories: InventoryResponseDTO[] = [];

  constructor(private inventoryService: InventoryService, private toastr : ToastService) {}

  ngOnInit(): void {
    this.loadInventories();
  }

  loadInventories() {
    this.inventoryService.getAll().subscribe({
      next: data => this.inventories = data,
      error: err => this.toastr.error('Error loading inventory: ' + err.message)
    });
  }
}

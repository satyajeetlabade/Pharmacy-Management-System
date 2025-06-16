// src/app/services/inventory.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  InventoryBulkCreateDTO,
  InventoryCreateDTO,
  InventoryResponseDTO,
  InventoryUpdateDTO,
} from '../models/inventory.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private baseUrl = 'api/Inventory';

  constructor(private http: HttpClient) {}

  getAll(): Observable<InventoryResponseDTO[]> {
    return this.http.get<InventoryResponseDTO[]>(`${this.baseUrl}`);
  }

  getById(id: number): Observable<InventoryResponseDTO> {
    return this.http.get<InventoryResponseDTO>(`${this.baseUrl}/${id}`);
  }

  add(data: InventoryCreateDTO): Observable<InventoryResponseDTO> {
    return this.http.post<InventoryResponseDTO>(`${this.baseUrl}/add`, data);
  }

  bulkAdd(data: InventoryBulkCreateDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/bulk-add`, data);
  }

  update(id: number, data: InventoryUpdateDTO): Observable<InventoryResponseDTO> {
    return this.http.put<InventoryResponseDTO>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

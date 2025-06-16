import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderResponseDto, OrderCreateDto, OrderVerifyDto, OrderPickupDto } from '../models/orders.model';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly apiUrl = 'api/Order';

  constructor(private http: HttpClient) {}

  getAll(): Observable<OrderResponseDto[]> {
    return this.http.get<OrderResponseDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<OrderResponseDto> {
    return this.http.get<OrderResponseDto>(`${this.apiUrl}/${id}`);
  }

  create(order: OrderCreateDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, order);
  }

  verifyOrder(id: number, dto: OrderVerifyDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/verify`, dto);
  }

  markAsPickedUp(id: number, dto: OrderPickupDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/pickup`, dto);
  }
}

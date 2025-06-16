import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ProductSalesDto {
  drugId: number;
  drugName: string;
  unitsSold: number;
  revenue: number;
}

export interface DailySalesDto {
  day: string; // ISO string
  revenue: number;
}

export interface SalesSummaryDto {
  totalOrders: number;
  totalRevenue: number;
  totalItemsSold: number;
  averageOrderValue: number;
  distinctDrugsSold: number;
  topSellingDrugs: ProductSalesDto[];
  salesByDay: DailySalesDto[];
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseUrl = 'api/reports'; // update to match your base API URL

  constructor(private http: HttpClient) {}

  getSalesSummary(fromDate: string, toDate: string): Observable<SalesSummaryDto> {
    const params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate);

    return this.http.get<SalesSummaryDto>(`${this.baseUrl}/sales-summary`, { params });
  }
}

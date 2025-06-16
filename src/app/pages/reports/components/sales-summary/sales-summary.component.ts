import { Component, NgModule } from '@angular/core';
import { ReportService, SalesSummaryDto } from '../../report.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-sales-summary',
  imports: [FormsModule,DatePipe, CurrencyPipe, CommonModule],
  standalone: true,
  templateUrl: './sales-summary.component.html',
})
export class SalesSummaryComponent {
  fromDate = '';
  toDate = '';
  summary: SalesSummaryDto | null = null;
  error: string = '';

  constructor(private reportService: ReportService) {}

  fetchSummary() {
    if (!this.fromDate || !this.toDate) {
      this.error = 'Both From Date and To Date are required.';
      return;
    }

    this.error = '';
    this.reportService.getSalesSummary(this.fromDate, this.toDate).subscribe({
      next: (data) => (this.summary = data),
      error: (err) => (this.error = 'Error fetching sales summary.'),
    });
  }
}

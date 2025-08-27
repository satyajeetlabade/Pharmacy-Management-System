import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SalesSummaryComponent } from './sales-summary.component';
import { ReportService, SalesSummaryDto } from '../../report.service';
import { of, throwError } from 'rxjs';
import { CurrencyPipe, DatePipe } from '@angular/common';

// Mock data
const mockSummary: SalesSummaryDto = {
  totalOrders: 30,
  totalRevenue: 15000,
  totalItemsSold: 450,
  averageOrderValue: 500,
  distinctDrugsSold: 15,
  topSellingDrugs: [
    {
      drugId: 1,
      drugName: 'Paracetamol',
      unitsSold: 150,
      revenue: 3000
    },
    {
      drugId: 2,
      drugName: 'Amoxicillin',
      unitsSold: 100,
      revenue: 2500
    }
  ],
  salesByDay: [
    {
      day: '2025-07-28T00:00:00.000Z',
      revenue: 5000
    },
    {
      day: '2025-07-29T00:00:00.000Z',
      revenue: 6000
    }
  ]
};


// Mock service
class MockReportService {
  getSalesSummary(from: string, to: string) {
    return of(mockSummary);
  }
}

describe('SalesSummaryComponent', () => {
  let component: SalesSummaryComponent;
  let fixture: ComponentFixture<SalesSummaryComponent>;
  let reportService: ReportService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesSummaryComponent],
      providers: [
        { provide: ReportService, useClass: MockReportService },
        CurrencyPipe,
        DatePipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SalesSummaryComponent);
    component = fixture.componentInstance;
    reportService = TestBed.inject(ReportService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not show date range invalid if dates are empty', () => {
    component.fromDate = '';
    component.toDate = '';
    expect(component.isDateRangeInvalid).toBeFalse();
  });

  it('should detect invalid date range', () => {
    component.fromDate = '2025-07-30';
    component.toDate = '2025-07-29';
    expect(component.isDateRangeInvalid).toBeTrue();
  });

  it('should call reportService and assign summary on successful fetch', () => {
    component.fromDate = '2025-07-01';
    component.toDate = '2025-07-30';

    spyOn(reportService, 'getSalesSummary').and.returnValue(of(mockSummary));
    component.fetchSummary();

    expect(component.error).toBe('');
    expect(component.summary).toEqual(mockSummary);
    expect(reportService.getSalesSummary).toHaveBeenCalledWith('2025-07-01', '2025-07-30');
  });

  it('should show error message when fromDate or toDate is missing', () => {
    component.fromDate = '';
    component.toDate = '';
    component.fetchSummary();
    expect(component.error).toBe('Both From Date and To Date are required.');
  });

  it('should handle service error gracefully', () => {
    component.fromDate = '2025-07-01';
    component.toDate = '2025-07-30';

    spyOn(reportService, 'getSalesSummary').and.returnValue(throwError(() => new Error('Error')));
    component.fetchSummary();

    expect(component.summary).toBeNull();
    expect(component.error).toBe('Error fetching sales summary.');
  });
});

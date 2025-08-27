import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DrugListComponent } from './drug-list.component';
import { DrugService } from '../../services/drug.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { Drug, DrugType } from '../../models/drug.model';

describe('DrugListComponent (Angular 17)', () => {
  let fixture: ComponentFixture<DrugListComponent>;
  let component: DrugListComponent;
  let drugServiceMock: any;
  let authServiceMock: any;
  let router: Router;

  const mockDrugs: Drug[] = [
    { id: 1, name: 'Paracetamol', quantityInStock: 100, price: 25 , expiryDate: new Date('2024-12-31'), drugType: DrugType.Tablet },
    { id: 2, name: 'Amoxicillin', quantityInStock: 50, price: 40, expiryDate: new Date('2025-01-15'), drugType: DrugType.Capsule }
  ];

  beforeEach(async () => {
    drugServiceMock = {
      getAll: jasmine.createSpy('getAll').and.returnValue(of(mockDrugs)),
      delete: jasmine.createSpy('delete').and.returnValue(of({}))
    };

    authServiceMock = {
      getUserRole: jasmine.createSpy('getUserRole')
    };

    await TestBed.configureTestingModule({
      imports: [DrugListComponent],
      providers: [
        { provide: DrugService, useValue: drugServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DrugListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load drugs on init and set isAdmin to true for non-Doctor roles', () => {
    authServiceMock.getUserRole.and.returnValue('Admin');
    component.loadDrugs();
    expect(drugServiceMock.getAll).toHaveBeenCalled();
    expect(component.drugs.length).toBe(2);
    expect(component.isAdmin).toBeTrue();
  });

  it('should set isAdmin to false if user is Doctor', () => {
    authServiceMock.getUserRole.and.returnValue('Doctor');
    component.loadDrugs();
    expect(component.isAdmin).toBeFalse();
  });

  it('should call delete and reload drugs when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.confirmDelete(1);
    expect(drugServiceMock.delete).toHaveBeenCalledWith(1);
    expect(drugServiceMock.getAll).toHaveBeenCalled(); // reloads after delete
  });

  it('should not delete if user cancels confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.confirmDelete(2);
    expect(drugServiceMock.delete).not.toHaveBeenCalled();
  });
});

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DrugEditComponent } from './drug-edit.component';
import { DrugService } from '../../../services/drug.service';
import { ToastrService } from 'ngx-toastr';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { DrugType } from '../../../models/drug.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('DrugEditComponent', () => {
  let component: DrugEditComponent;
  let fixture: ComponentFixture<DrugEditComponent>;
  let drugServiceMock: any;
  let toastrMock: any;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    drugServiceMock = {
      getById: jasmine.createSpy('getById'),
      update: jasmine.createSpy('update')
    };

    toastrMock = {
      success: jasmine.createSpy('success')
    };

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [DrugEditComponent, ReactiveFormsModule, CommonModule],
      providers: [
        { provide: DrugService, useValue: drugServiceMock },
        { provide: ToastrService, useValue: toastrMock },
        { provide: Router, useValue: routerSpy },
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: () => '1'
            })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DrugEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and initialize form', () => {
    expect(component).toBeTruthy();
    expect(component.drugForm).toBeDefined();
  });

  it('should load drug data and patch form values', fakeAsync(() => {
    const mockDrug = {
      id: 1,
      name: 'Paracetamol',
      description: 'Painkiller',
      price: 50,
      quantityInStock: 20,
      expiryDate: '2099-12-31T00:00:00',
      drugType: DrugType.Tablet
    };

    drugServiceMock.getById.and.returnValue(of(mockDrug));

    component.loadDrugData(1);
    tick();

    expect(drugServiceMock.getById).toHaveBeenCalledWith(1);
    expect(component.drugForm.get('name')?.value).toBe('Paracetamol');
  }));

  it('should submit form and call update()', fakeAsync(() => {
    drugServiceMock.update.and.returnValue(of({}));
    component.drugId = 1;

    component.drugForm.setValue({
      id: 1,
      name: 'Ibuprofen',
      description: 'Anti-inflammatory',
      price: 30,
      quantityInStock: 10,
      expiryDate: '2099-12-31',
      drugType: DrugType.Capsule
    });

    component.onSubmit();
    tick();

    expect(drugServiceMock.update).toHaveBeenCalledWith(1, jasmine.objectContaining({
      name: 'Ibuprofen',
      price: 30
    }));
    expect(toastrMock.success).toHaveBeenCalledWith('Drug updated successfully.');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/drugs']);
  }));

  it('should not call update if form is invalid', () => {
    component.drugForm.patchValue({
      name: '',
      price: -1,
      quantityInStock: 0,
      expiryDate: '',
      drugType: null
    });

    component.onSubmit();

    expect(drugServiceMock.update).not.toHaveBeenCalled();
    expect(toastrMock.success).not.toHaveBeenCalled();
  });
});

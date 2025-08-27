import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DrugFormComponent } from './drug-form.component';
import { DrugService } from '../../services/drug.service';
import { ToastrService } from 'ngx-toastr';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { DrugType } from '../../models/drug.model';
import { CommonModule } from '@angular/common';

describe('DrugFormComponent (Angular 17)', () => {
  let fixture: ComponentFixture<DrugFormComponent>;
  let component: DrugFormComponent;
  let drugServiceMock: any;
  let toastrMock: any;
  let router: Router;

  beforeEach(async () => {
    drugServiceMock = {
      create: jasmine.createSpy('create')
    };

    toastrMock = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error')
    };

    await TestBed.configureTestingModule({
      imports: [DrugFormComponent, ReactiveFormsModule, CommonModule],
      providers: [
        { provide: DrugService, useValue: drugServiceMock },
        { provide: ToastrService, useValue: toastrMock },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DrugFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges(); // Triggers ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize drug form with default values and validators', () => {
    expect(component.drugForm).toBeDefined();
    expect(component.drugForm.get('name')?.value).toBe('');
    expect(component.drugForm.valid).toBeFalse();
  });

  it('should submit the form and navigate on success', fakeAsync(() => {
    const navigateSpy = spyOn(router, 'navigate');
    drugServiceMock.create.and.returnValue(of({ success: true }));

    component.drugForm.setValue({
      name: 'Ibuprofen',
      description: 'Painkiller',
      price: 50,
      quantityInStock: 100,
      expiryDate: '2099-12-31',
      drugType: DrugType.Capsule
    });

    component.onSubmit();
    tick();

    expect(drugServiceMock.create).toHaveBeenCalledWith(component.drugForm.value);
    expect(toastrMock.success).toHaveBeenCalledWith('Drug created successfully.');
    expect(navigateSpy).toHaveBeenCalledWith(['/drugs']);
  }));

  it('should show error toast on API failure', fakeAsync(() => {
    drugServiceMock.create.and.returnValue(
      throwError({ message: 'Server error' })
    );

    component.drugForm.setValue({
      name: 'Ibuprofen',
      description: 'Painkiller',
      price: 50,
      quantityInStock: 100,
      expiryDate: '2099-12-31',
      drugType: DrugType.Capsule
    });

    component.onSubmit();
    tick();

    expect(toastrMock.error).toHaveBeenCalledWith('Error creating drug: Server error');
  }));

  it('should not submit form if invalid', () => {
    component.drugForm.patchValue({
      name: '',
      price: 0,
      quantityInStock: -5,
      expiryDate: '',
      drugType: null
    });

    component.onSubmit();

    expect(drugServiceMock.create).not.toHaveBeenCalled();
    expect(toastrMock.success).not.toHaveBeenCalled();
  });
});

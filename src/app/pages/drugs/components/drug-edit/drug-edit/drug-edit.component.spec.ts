import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugEditComponent } from './drug-edit.component';

describe('DrugEditComponent', () => {
  let component: DrugEditComponent;
  let fixture: ComponentFixture<DrugEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrugEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DrugEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

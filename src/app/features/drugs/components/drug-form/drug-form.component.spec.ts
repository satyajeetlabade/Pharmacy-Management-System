import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugFormComponent } from './drug-form.component';

describe('DrugFormComponent', () => {
  let component: DrugFormComponent;
  let fixture: ComponentFixture<DrugFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrugFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DrugFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

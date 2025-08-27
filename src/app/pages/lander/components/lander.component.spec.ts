import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanderComponent } from './lander.component';

describe('LanderComponent', () => {
  let component: LanderComponent;
  let fixture: ComponentFixture<LanderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanderComponent] // since standalone
    }).compileComponents();

    fixture = TestBed.createComponent(LanderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the image URL correctly', () => {
    expect(component.imgUrl).toBe('assets/images/lander.png');
  });

  it('should set the current year correctly', () => {
    const expectedYear = new Date().getFullYear();
    expect(component.currentYear).toBe(expectedYear);
  });
});

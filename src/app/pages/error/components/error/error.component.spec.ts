import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorComponent } from './error.component';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorComponent] // standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call location.reload when reloadPage is invoked', () => {
    spyOn(location, 'reload');
    component.reloadPage();
    expect(location.reload).toHaveBeenCalled();
  });
});

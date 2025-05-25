import { Component } from '@angular/core';
import { DoctorComponent } from '../../../doctor/components/doctor/doctor.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [DoctorComponent, AdminComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

}

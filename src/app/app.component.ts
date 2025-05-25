import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AdminComponent } from "./features/admin/components/admin/admin.component";
import { DoctorComponent } from "./features/doctor/components/doctor/doctor.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Pharmacy-Management-System';
}

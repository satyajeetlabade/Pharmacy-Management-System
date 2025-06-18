import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lander',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './lander.component.html',
  styleUrl: './lander.component.css'
})
export class LanderComponent {
  imgUrl = 'assets/images/lander.png';
  currentYear = new Date().getFullYear();

}

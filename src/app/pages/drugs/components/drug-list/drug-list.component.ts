import { Component, OnInit } from '@angular/core';
import { Drug } from '../../models/drug.model';
import { DrugService } from '../../services/drug.service';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
  selector: 'app-drug-list',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './drug-list.component.html',
  styleUrl: './drug-list.component.css'
})
export class DrugListComponent implements OnInit{
  drugs : Drug[] = [];
  isAdmin: boolean = true;

  
  constructor(private drugService : DrugService, private router : Router, private authService: AuthService){}
  
  ngOnInit(): void {
    this.loadDrugs();

  }
  loadDrugs() {
    this.drugService.getAll().subscribe(data => this.drugs = data);
    const userRole = this.authService.getUserRole();
    if(userRole == 'Doctor')
        this.isAdmin = false;
  }

  confirmDelete(id: number){
    if(confirm('Are you sure you want to delete this drug?')){
      this.drugService.delete(id).subscribe(() => this.loadDrugs())
    }
  }
}

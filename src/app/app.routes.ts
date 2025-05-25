import { Routes } from '@angular/router';
import { DrugListComponent } from './features/drugs/components/drug-list/drug-list.component';
import { DoctorComponent } from './features/doctor/components/doctor/doctor.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DrugFormComponent } from './features/drugs/components/drug-form/drug-form.component';
import { DrugEditComponent } from './features/drugs/components/drug-edit/drug-edit/drug-edit.component';

export const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'drugs', component: DrugListComponent },
  {path : 'drug/create', component: DrugFormComponent},
  {path: 'drugs/edit/:id', component: DrugEditComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }

];

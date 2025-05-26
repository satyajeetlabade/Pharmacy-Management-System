import { Routes } from '@angular/router';
import { DrugListComponent } from './features/drugs/components/drug-list/drug-list.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DrugFormComponent } from './features/drugs/components/drug-form/drug-form.component';
import { DrugEditComponent } from './features/drugs/components/drug-edit/drug-edit/drug-edit.component';
import { SupplierFormComponent } from './features/admin/components/supplier/supplier-form/supplier-form.component';
import { SupplierListComponent } from './features/admin/components/supplier/supplier-list/supplier-list.component';
import { SupplierEditComponent } from './features/admin/components/supplier/supplier-edit/supplier-edit.component';

export const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'drugs', component: DrugListComponent },
  {path : 'drug/create', component: DrugFormComponent},
  {path: 'drugs/edit/:id', component: DrugEditComponent},
  {path: 'admin/supplier/create', component: SupplierFormComponent},
  { path: 'admin/suppliers', component: SupplierListComponent },
  { path: 'admin/supplier/edit/:id', component: SupplierEditComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }

];

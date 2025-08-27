import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { RoleGuard } from './core/guards/role/role.guard';
import { DrugEditComponent } from './pages/drugs/components/drug-edit/drug-edit/drug-edit.component';
import { DrugFormComponent } from './pages/drugs/components/drug-form/drug-form.component';
import { DrugListComponent } from './pages/drugs/components/drug-list/drug-list.component';
import { InventoryFormComponent } from './pages/inventory/components/inventory-form/inventory-form.component';
import { InventoryComponent } from './pages/inventory/components/inventory-list/inventory-list.component';
import { LanderComponent } from './pages/lander/components/lander.component';
import { OrderCreateComponent } from './pages/orders/components/order-create/order-create.component';
import { OrderDetailsComponent } from './pages/orders/components/order-details/order-details.component';
import { OrderListComponent } from './pages/orders/components/order-list/order-list.component';
import { SalesSummaryComponent } from './pages/reports/components/sales-summary/sales-summary.component';
import { SupplierEditComponent } from './pages/supplier/components/supplier-edit/supplier-edit.component';
import { SupplierFormComponent } from './pages/supplier/components/supplier-form/supplier-form.component';
import { SupplierListComponent } from './pages/supplier/components/supplier-list/supplier-list.component';
import { UnauthorizedComponent } from './shared/unauthorized/unauthorized.component';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { ErrorComponent } from './pages/error/components/error/error.component';
import { RegisterComponent } from './auth/components/register/register.component';


export const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {path: 'welcome', component: LanderComponent},

  {
    path: 'drugs',
    component: DrugListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'drugs/create',
    component: DrugFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Admin' }
  },
  {
    path: 'drugs/edit/:id',
    component: DrugEditComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Admin' }
  },

  {
    path: 'orders',
    component: OrderListComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: ['Doctor', 'Admin'] }
  },
  {
    path: 'orders/create',
    component: OrderCreateComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Doctor' }
  },
  {
    path: 'orders/details/:id',
    component: OrderDetailsComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: ['Doctor', 'Admin'] }
  },

  {
    path: 'admin/suppliers',
    component: SupplierListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Admin' }
  },
  {
    path: 'admin/supplier/create',
    component: SupplierFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Admin' }
  },
  {
    path: 'admin/supplier/edit/:id',
    component: SupplierEditComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Admin' }
  },

  {
    path: 'admin/reports/sales-summary',
    component: SalesSummaryComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Admin' }
  },

   { path: 'admin/inventory', 
    component: InventoryComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Admin' }
  },
  {
    path: 'admin/inventory/add',
    component: InventoryFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {expectedRole: 'Admin'}
  },

  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },

   { path: 'error', component: ErrorComponent },

  { path: '', redirectTo: 'welcome', pathMatch: 'full',},
  { path: '**', redirectTo: 'welcome'}
];
  

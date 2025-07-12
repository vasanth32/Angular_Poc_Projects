import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Admin } from './admin/admin';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';

const routes: Routes = [
  {
    path: '',
    component: Admin,
    children: [
      {
        path: 'dashboard',
        component: AdminDashboard
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AdminRoutingModule } from './admin-routing-module';
import { Admin } from './admin/admin';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';


@NgModule({
  declarations: [
    Admin,
    AdminDashboard
  ],
  imports: [
    CommonModule,
    RouterModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }

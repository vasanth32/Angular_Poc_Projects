import { Routes } from '@angular/router';
import { UserFormComponent } from './user-form/user-form.component';

export const routes: Routes = [
  { path: '', component: UserFormComponent }, // ✅ route to form
  { path: '**', redirectTo: '' } // catch-all route
]; 
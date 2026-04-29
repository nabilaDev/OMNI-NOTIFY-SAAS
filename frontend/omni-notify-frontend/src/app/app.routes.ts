import { Routes } from '@angular/router';
import {Dashboard} from "./features/dashboard/dashboard";
import {LoginComponent} from "./features/login/login";
import { authGuard } from './core/guards/auth-guard';
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard',component: Dashboard,  canActivate: [authGuard] }
];

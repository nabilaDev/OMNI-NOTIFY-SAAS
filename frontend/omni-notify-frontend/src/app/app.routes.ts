import { Routes } from '@angular/router';
import {Dashboard} from "./features/dashboard/dashboard";
import {LoginComponent} from "./features/login/login";
import { authGuard } from './core/guards/auth-guard';
import {NotificationsList} from "./features/dashboard/notifications-list/notifications-list";
import {History} from "./features/dashboard/history/history";
import {Settings} from "./features/dashboard/settings/settings"; 
// app.routes.ts
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: Dashboard, 
    canActivate: [authGuard],
    children: [
      // Si tu veux que ces rubriques s'affichent DANS le dashboard
      { path: 'notifications', component: NotificationsList},
      { path: 'historique', component: History },
      { path: 'parametres', component: Settings},
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

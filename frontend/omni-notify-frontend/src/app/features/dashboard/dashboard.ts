import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router'; // Imports essentiels pour le routage
import { NotificationService } from '../../core/services/notification';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // Ajout de RouterOutlet et RouterModule ici
  imports: [CommonModule, RouterOutlet, RouterModule], 
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  // Injecter le Router pour l'utiliser dans le HTML (condition @if router.url)
  public router = inject(Router); 

  // On récupère le signal des notifications du service
  notifications = this.notificationService.notifications;
  userName: string = '';

  ngOnInit() {
    console.log('🚀 Dashboard initialisé');
    const user = this.authService.currentUserValue;
    
    if (user) {
      // Priorité au nom s'il existe, sinon l'email
      this.userName = user.username || user.email; 
    }
  }

  logout() {
    this.authService.logout();
  }
  // Dans ta classe Dashboard
getSimulatedHeight(index: number): number {
  const count = this.notifications().length;
  if (count === 0) return 10;
  // Crée un effet de variation simple basé sur le nombre total
  return Math.min(100, (count / (index + 1)) * 2);
}
}
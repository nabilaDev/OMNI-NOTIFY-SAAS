import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-notifications-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications-list.html',
  styleUrl: './notifications-list.scss'
})
export class NotificationsList {
  private notificationService = inject(NotificationService);

  // Accès direct au Signal des notifications du service
  notifications = this.notificationService.notifications;

  /**
   * Action pour marquer une notification comme lue.
   * Elle sera mise à jour localement puis envoyée au backend.
   */
  markAsRead(id: string) {
    this.notificationService.markAsRead(id).subscribe({
      next: () => console.log(`Notification ${id} marquée comme lue`),
      error: (err) => console.error('Erreur lors du marquage:', err)
    });
  }

  /**
   * Action pour vider la liste actuelle (optionnel)
   */
  clearAll() {
    this.notificationService.notifications.set([]);
  }
}
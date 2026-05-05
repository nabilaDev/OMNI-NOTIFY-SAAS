
// notification.service.ts
import { Injectable, signal, inject, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  private socket!: Socket;
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  
  // URL du backend (à centraliser idéalement dans environment.ts)
  private readonly API_URL = 'http://localhost:3000';

  // Signal pour une réactivité fluide dans le Dashboard
  public notifications = signal<any[]>([]);

  constructor() {
    this.initNotificationSystem();
  }

  private initNotificationSystem() {
    const user = this.authService.currentUserValue;

    // 1. Initialisation de la connexion Socket.io
    // On passe le userId dans la query pour que le server.ts puisse faire le socket.join(userId)
    this.socket = io(this.API_URL, {
      transports: ['websocket'],
      autoConnect: true,
      query: { userId: user?.id } 
    });

    // 2. Chargement initial de l'historique (Persistance)
    this.fetchHistory();

    // 3. Écoute de la connexion réussie
    this.socket.on('connect', () => {
      console.log('✅ Connecté au serveur WebSocket - ID:', this.socket.id);
    });

    // 4. Réception des notifications en temps réel
    // Correspond au io.to(userId).emit('notification:new', ...) de ton contrôleur
    this.socket.on('notification:new', (newNotif: any) => {
      console.log('🔔 Nouvelle notification reçue :', newNotif);
      
      this.notifications.update(current => [
        {
          ...newNotif,
          timestamp: newNotif.createdAt || new Date(),
          read: newNotif.status === 'read'
        },
        ...current
      ]);
    });

    // 5. Gestion des erreurs de connexion
    this.socket.on('connect_error', (err) => {
      console.error('❌ Erreur de connexion Socket:', err.message);
    });
  }

  /**
   * Récupère l'historique des notifications depuis l'API REST
   */
  private fetchHistory() {
    this.http.get<any[]>(`${this.API_URL}/api/notifications`).subscribe({
      next: (history) => {
        this.notifications.set(history);
      },
      error: (err) => console.error('Impossible de charger l\'historique', err)
    });
  }

  /**
   * Marquer une notification comme lue
   */
// notification.service.ts
markAsRead(notificationId: string) {
  return this.http.patch(`/api/notifications/${notificationId}/read`, {}).pipe(
    tap(() => {
      // On met à jour localement le signal pour une interface instantanée
     this.notifications.update(list => list.filter(n => (n._id || n.id) !== notificationId));
      
  
    })
  );
}
  

  /**
   * Nettoyage à la destruction du service (logout)
   */
  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
  
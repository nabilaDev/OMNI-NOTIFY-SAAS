import { Injectable, inject, signal } from '@angular/core'; // Ajoute signal
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // 1. On crée un signal pour l'état de connexion, initialisé avec le localStorage
  // Cela permet aux Guards et aux composants de savoir instantanément si on est logué
  public isAuthenticated = signal<boolean>(!!localStorage.getItem('access_token'));

  get currentUserValue() {
    try {
      const userData = localStorage.getItem('user_data');
      // On vérifie que userData existe ET n'est pas la chaîne "undefined"
      if (!userData || userData === 'undefined') return null;
      return JSON.parse(userData);
    } catch (e) {
      console.error("Erreur de parsing du user_data", e);
      return null;
    }
  }

  login(email: string, password: string) {
    return this.http.post<any>('/api/auth/login', { email, password }).pipe(
      tap(res => {
        console.log('Login réussi, données reçues:', res);
        localStorage.setItem('access_token', res.token);
        localStorage.setItem('user_data', JSON.stringify(res.user));
        
        // 2. On met à jour le signal après un login réussi
        this.isAuthenticated.set(true);
      }),
      catchError(err => {
        this.isAuthenticated.set(false);
        return throwError(() => err);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    
    // 3. On remet le signal à false
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}
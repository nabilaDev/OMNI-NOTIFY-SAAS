import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  login(email: string, password: string) {
    // On utilise /api pour que le proxy prenne le relai
    return this.http.post<any>('/api/auth/login', { email, password }).pipe(
      tap(res => {
       // On stocke le token pour les prochaines requêtes
        localStorage.setItem('access_token', res.token);
        // On peut aussi stocker les infos de l'utilisateur si besoin
        localStorage.setItem('user_data', JSON.stringify(res.user));
      }),
      catchError(err => {
        console.error('Erreur Login Service:', err);
        return throwError(() => err);
      })
    );
  }

  // Ajoute une méthode pour récupérer le token facilement
getToken(): string | null {
  return localStorage.getItem('access_token');
}
}
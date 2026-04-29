import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.getRawValue();
      
      this.authService.login(email!, password!).subscribe({
        next: (res) => {
          console.log('Connexion réussie !', res);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Erreur de connexion', err);
          alert('Identifiants invalides');
        }
      });
    }
  }
}
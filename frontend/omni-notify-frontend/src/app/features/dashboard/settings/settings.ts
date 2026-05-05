import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-settings',
  imports: [CommonModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings implements OnInit {
  userEmail: string = 'joury.dev@example.com';
  notificationsEnabled: boolean = true;
  theme: string = 'light';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userEmail = this.authService.currentUserValue?.email || this.userEmail;
  }

  saveSettings(): void {
    // TODO: Call backend API on Docker port 3000
  }
}
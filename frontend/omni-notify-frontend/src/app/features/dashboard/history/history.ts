import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './history.html',
  styleUrl: './history.scss'
})
export class History implements OnInit {
  private http = inject(HttpClient);
  
  historyItems = signal<any[]>([]);
  isLoading = signal<boolean>(true);
  searchTerm = signal<string>(''); 

  // Liste filtrée dynamiquement
  filteredHistory = computed(() => {
    return this.historyItems().filter(item => {
      const matchesSearch = item.message.toLowerCase().includes(this.searchTerm().toLowerCase());
      return matchesSearch ;
    });
  });

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.isLoading.set(true);
    this.http.get<any[]>('/api/notifications/history').subscribe({
      next: (data) => {
      this.historyItems.set([...data]);
        this.isLoading.set(false);
      },
      error: () => {
        this.historyItems.set([]); // On vide en cas d'erreur
        this.isLoading.set(false);
      }
    });
  }
}
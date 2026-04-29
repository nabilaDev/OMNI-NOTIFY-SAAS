import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {



  logout() {  
   localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    window.location.href = '/login';
  } 

}

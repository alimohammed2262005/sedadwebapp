import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-dash-board',
  imports: [],
  templateUrl: './admin-dash-board.html',
  styleUrl: './admin-dash-board.css',
})
export class AdminDashBoard {
 constructor(private routing: Router) {}
  UsersInfo() { this.routing.navigate(['/userinfo']); }
}

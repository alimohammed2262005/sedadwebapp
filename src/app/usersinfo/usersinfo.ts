import { Component, OnInit, OnDestroy } from '@angular/core';
import { Adminservice } from '../adminservice';
import { Userinfo } from '../Interfaces/userinfo';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usersinfo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usersinfo.html',
  styleUrls: ['./usersinfo.css'],
})
export class Usersinfo implements OnInit, OnDestroy {
  users: Userinfo[] = [];
  private intervalId: any;

  constructor(private http: Adminservice) {}

  ngOnInit() {
    this.GetAllUsers();

    this.intervalId = setInterval(() => {
      this.GetAllUsers();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  GetAllUsers() {
    this.http.GetAllUsers().subscribe({
      next: (res) => {
        this.users = res;
      },
      error: () => {
        this.users = [];
      }
    });
  }
}

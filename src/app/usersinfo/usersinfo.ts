import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Adminservice } from '../adminservice';
import { Userinfo } from '../Interfaces/userinfo';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usersinfo',
  imports: [CommonModule],
  templateUrl: './usersinfo.html',
  styleUrls: ['./usersinfo.css'],
})
export class Usersinfo implements OnInit {
  users: Userinfo[] = [];
  phone: string = '';

  constructor(private http: Adminservice, private route: ActivatedRoute) {}

  ngOnInit() {
  this.GetAllUsers();
  }

  GetAllUsers() {
    this.http.GetAllUsers().subscribe({
      next: (res) => {
        this.users = res;
      },
      error: (err) => {
        this.users = [];
      }
    });
  }
}

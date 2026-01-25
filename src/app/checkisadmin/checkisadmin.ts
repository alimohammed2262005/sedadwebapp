import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkisadmin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './checkisadmin.html',
  styleUrl: './checkisadmin.css',
})
export class Checkisadmin {
  phone: string = '';

  constructor(private router: Router) {}

  checkAdmin() {
    if (!this.phone || this.phone.trim() === '') {
      alert('لا تملك صلاحية دخول');
      return;
    }

    this.router.navigate(['/userinfo'], {
      queryParams: { phone: this.phone }
    });
  }
}

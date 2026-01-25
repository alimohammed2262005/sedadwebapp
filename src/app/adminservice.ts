import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from './Environment/environment';
import { Userinfo } from './Interfaces/userinfo';
@Injectable({
  providedIn: 'root',
})
export class Adminservice {
  constructor(private http:HttpClient){}
  GetAllUsers(){
   return this.http.get<Userinfo[]>(Environment.api+'api/Admin/users')
  }
}

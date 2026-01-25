import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from './Environment/environment';
import { Login } from './Interfaces/login';
import { OTP } from './Interfaces/otp';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
 constructor(private http:HttpClient){}
 LogIn(login:Login){
return this.http.post(Environment.api + 'Authentication/login', login, { responseType: 'text' as 'json' });
 } 
 OTP(otp:OTP){
    return this.http.post<string>(Environment.api+'Authentication/enter-otp',otp)
 }
}

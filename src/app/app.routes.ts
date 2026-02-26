import { Routes } from '@angular/router';
import { AdminDashBoard } from './admin-dash-board/admin-dash-board';
import { Usersinfo } from './usersinfo/usersinfo';
import { Home } from './home/home';
import { LogIn } from './log-in/log-in';
import { OTP } from './otp/otp';
import { Checkisadmin } from './checkisadmin/checkisadmin';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LogIn },
  { path: 'dddvgddre_eehege877332*ddgd##fd', component: AdminDashBoard },
  { path: 'userinfo', component: Usersinfo },
  { path: 'home', component: Home },
  { path: 'otp', component: OTP },
  {path:'check',component:Checkisadmin},
  { path: '**', redirectTo: 'login' }
];

import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../login-service';
import { Login } from '../Interfaces/login';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './log-in.html',
  styleUrls: ['./log-in.css'],
})
export class LogIn implements AfterViewInit {
  @ViewChildren('digitInput') digitInputs!: QueryList<ElementRef<HTMLInputElement>>;
  phoneNumber: string = '';
  passwordDigits: string[] = ['', '', '', ''];
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private loginService: LoginService, private router: Router) {}

  ngAfterViewInit(): void {}

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.phoneNumber = input.value.replace(/[^0-9]/g, '').slice(0, 8);
    input.value = this.phoneNumber;
  }

  onDigitInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '');
    if (value.length > 0) {
      value = value.slice(-1);
      this.passwordDigits[index] = value;
      input.value = value;
      if (index < 3) {
        const nextInput = this.digitInputs.toArray()[index + 1]?.nativeElement;
        if (nextInput) {
          nextInput.focus();
          nextInput.select();
        }
      }
    } else {
      this.passwordDigits[index] = '';
      input.value = '';
    }
  }

  onDigitKeydown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (input.value) {
        this.passwordDigits[index] = '';
        input.value = '';
      } else if (index > 0) {
        const prevInput = this.digitInputs.toArray()[index - 1]?.nativeElement;
        if (prevInput) {
          this.passwordDigits[index - 1] = '';
          prevInput.value = '';
          prevInput.focus();
          prevInput.select();
        }
      }
    }
    if (event.key === 'ArrowLeft' && index < 3) {
      event.preventDefault();
      this.digitInputs.toArray()[index + 1]?.nativeElement.focus();
    }
    if (event.key === 'ArrowRight' && index > 0) {
      event.preventDefault();
      this.digitInputs.toArray()[index - 1]?.nativeElement.focus();
    }
    if (event.key.length === 1 && !/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  onDigitPaste(event: ClipboardEvent, index: number): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text');
    if (pastedData) {
      const digits = pastedData.replace(/[^0-9]/g, '').split('').slice(0, 4 - index);
      digits.forEach((digit, i) => {
        const currentIndex = index + i;
        if (currentIndex < 4) {
          this.passwordDigits[currentIndex] = digit;
          const currentInput = this.digitInputs.toArray()[currentIndex]?.nativeElement;
          if (currentInput) currentInput.value = digit;
        }
      });
      const nextIndex = Math.min(index + digits.length, 3);
      this.digitInputs.toArray()[nextIndex]?.nativeElement.focus();
    }
  }

  onDigitFocus(event: FocusEvent): void {
    (event.target as HTMLInputElement).select();
  }

  isFormValid(): boolean {
    return this.phoneNumber.length === 8 && this.passwordDigits.every(d => d !== '');
  }

  clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }

  async onSubmit(): Promise<void> {
    if (!this.isFormValid()) return;
    this.isLoading = true;
    this.clearMessages();
    const password = this.passwordDigits.join('');
    const loginPayload: Login = { phone: this.phoneNumber, password };
    try {
      const response: any = await this.loginService.LogIn(loginPayload).toPromise();
      this.router.navigate(['/otp'], { queryParams: { phone: this.phoneNumber } });
    } catch (error: any) {
      this.errorMessage = error?.error?.message || error?.message || 'خطأ في رقم الهاتف أو كلمة المرور';
    } finally {
      this.isLoading = false;
    }
  }

  isBoxFilled(index: number): boolean {
    return this.passwordDigits[index] !== '';
  }
    forgetpassword(){
      window.open('https://bmi.mr', '_blank');

  }
  register(){
  window.open('https://bmi.mr', '_blank');
  }
}

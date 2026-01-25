import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../login-service';
import { OTP as OTPInterface } from '../Interfaces/otp';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './otp.html',
  styleUrls: ['./otp.css'],
})
export class OTP implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;
  otp: string[] = ['', '', '', '', '', ''];
  totalTime = 300;
  timeLeft = 300;
  timerText = '05:00';
  progressOffset = 408.41;
  circumference = 408.41;
  strokeColor = '#1a3a52';
  timerInterval: any;
  expired = false;
  phoneNumber: string | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router, private route: ActivatedRoute, private loginService: LoginService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.phoneNumber = params['phone'] || null;
      if (!this.phoneNumber) {
        this.router.navigate(['/login']);
        return;
      }
      setTimeout(() => this.startTimer(), 100);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.otpInputs.first?.nativeElement.focus(), 200);
  }

  ngOnDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  startTimer() {
    this.updateProgress();
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      const min = Math.floor(this.timeLeft / 60);
      const sec = this.timeLeft % 60;
      this.timerText = `${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
      this.updateProgress();
      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.expired = true;
      }
    }, 1000);
  }

  updateProgress() {
    const elapsed = this.totalTime - this.timeLeft;
    this.progressOffset = this.circumference - (elapsed / this.totalTime) * this.circumference;
    this.strokeColor = '#1a3a52';
  }

  onInput(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '');
    if (value.length > 0) {
      value = value.slice(-1);
      this.otp[index] = value;
      input.value = value;
      if (index < 5) {
        const nextInput = this.otpInputs.toArray()[index + 1]?.nativeElement;
        if (nextInput) {
          nextInput.focus();
          nextInput.select();
        }
      }
    } else {
      this.otp[index] = '';
      input.value = '';
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (input.value) {
        this.otp[index] = '';
        input.value = '';
      } else if (index > 0) {
        const prev = this.otpInputs.toArray()[index - 1]?.nativeElement;
        if (prev) {
          this.otp[index - 1] = '';
          prev.value = '';
          prev.focus();
          prev.select();
        }
      }
    }
    if (event.key === 'ArrowRight' && index < 5) {
      event.preventDefault();
      this.otpInputs.toArray()[index + 1]?.nativeElement.focus();
    }
    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.otpInputs.toArray()[index - 1]?.nativeElement.focus();
    }
    if (event.key.length === 1 && !/[0-9]/.test(event.key)) event.preventDefault();
  }

  onPaste(event: ClipboardEvent, index: number) {
    event.preventDefault();
    const data = event.clipboardData?.getData('text') || '';
    const digits = data.replace(/[^0-9]/g, '').split('');
    digits.forEach((d, i) => {
      const currentIndex = index + i;
      if (currentIndex < 6) {
        this.otp[currentIndex] = d;
        const input = this.otpInputs.toArray()[currentIndex]?.nativeElement;
        if (input) input.value = d;
      }
    });
    const nextIndex = Math.min(index + digits.length, 5);
    this.otpInputs.toArray()[nextIndex]?.nativeElement.focus();
  }

  trackByIndex(index: number): number {
    return index;
  }

  onDigitFocus(event: FocusEvent): void {
    (event.target as HTMLInputElement).select();
  }

  isFilled(index: number) {
    return this.otp[index] !== '';
  }

  async submit() {
    const code = this.otp.join('');
    if (code.length !== 6) {
      this.errorMessage = 'من فضلك أدخل الكود كاملاً';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    const payload: OTPInterface = { phoneNumber: this.phoneNumber!, otp: code };
    try {
      const response: any = await this.loginService.OTP(payload).toPromise();
      if (response) localStorage.setItem('authToken', response);
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.errorMessage = error?.error?.message || error?.message || 'كود OTP غير صحيح';
    } finally {
      this.isLoading = false;
    }
  }

  resend() {
    window.location.reload();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
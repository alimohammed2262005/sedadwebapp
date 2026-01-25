import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef } from '@angular/core';
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
export class OTP implements OnInit, OnDestroy {
  totalTime = 300;
  timeLeft = 300;
  timerText = '05:00';
  progressOffset = 0;
  circumference = 408.41;
  otp: string[] = ['', '', '', '', '', ''];
  timerInterval: any;
  expired = false;
  phoneNumber: string | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.phoneNumber = params['phone'] || null;
      if (!this.phoneNumber) {
        this.router.navigate(['/login']);
        return;
      }
      this.startTimer();
    });
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
    const timeElapsed = this.totalTime - this.timeLeft;
    this.progressOffset = this.circumference - (timeElapsed / this.totalTime) * this.circumference;
    
    const progressCircle = document.querySelector('.progress-ring .progress') as SVGCircleElement;
    if (progressCircle) {
      progressCircle.style.strokeDashoffset = this.progressOffset.toString();
      
      const percentage = (this.timeLeft / this.totalTime) * 100;
      if (percentage > 50) {
        progressCircle.style.stroke = '#d4af37';
      } else if (percentage > 25) {
        progressCircle.style.stroke = '#f4c430';
      } else {
        progressCircle.style.stroke = '#ff6b6b';
      }
    }
  }

  onInput(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '');
    
    if (value.length > 1) {
      value = value.charAt(value.length - 1);
    }
    
    if (this.otp[index] === value) {
      return;
    }
    
    this.otp[index] = value;
    input.value = value;

    if (value && index < 5) {
      setTimeout(() => {
        const next = this.otpInputs.toArray()[index + 1]?.nativeElement;
        if (next) {
          next.focus();
          next.select();
        }
      }, 10);
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace') {
      if (this.otp[index]) {
        this.otp[index] = '';
        input.value = '';
      } else if (index > 0) {
        const prev = this.otpInputs.toArray()[index - 1]?.nativeElement;
        if (prev) {
          this.otp[index - 1] = '';
          prev.value = '';
          prev.focus();
        }
      }
      event.preventDefault();
    }
  }

  onPaste(event: ClipboardEvent, index: number) {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text').replace(/[^0-9]/g, '').slice(0, 6) || '';
    
    for (let i = 0; i < pasteData.length && (index + i) < 6; i++) {
      this.otp[index + i] = pasteData[i];
      const input = this.otpInputs.toArray()[index + i]?.nativeElement;
      if (input) input.value = pasteData[i];
    }

    const nextIndex = Math.min(index + pasteData.length, 5);
    const nextInput = this.otpInputs.toArray()[nextIndex]?.nativeElement;
    if (nextInput) nextInput.focus();
  }

  async submit() {
    const code = this.otp.join('');
    if (code.length !== 6) {
      this.errorMessage = 'من فضلك أدخل الكود كاملاً';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload: OTPInterface = { 
      phoneNumber: this.phoneNumber!, 
      otp: code 
    };

    try {
      const response = await this.loginService.OTP(payload).toPromise();
      if (response) {
        localStorage.setItem('authToken', response);
      }
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.errorMessage = error?.error?.message || error?.message || 'كود OTP غير صحيح';
    } finally {
      this.isLoading = false;
    }
  }

  resend() {
    clearInterval(this.timerInterval);
    this.timeLeft = this.totalTime;
    this.expired = false;
    this.otp = ['', '', '', '', '', ''];
    this.progressOffset = 0;
    this.timerText = '05:00';
    this.errorMessage = '';

    const progressCircle = document.querySelector('.progress-ring .progress') as SVGCircleElement;
    if (progressCircle) {
      progressCircle.style.stroke = '#d3d3d3';
      progressCircle.style.strokeDashoffset = '0';
    }

    this.otpInputs.forEach(input => {
      input.nativeElement.value = '';
    });

    setTimeout(() => {
      this.otpInputs.first.nativeElement.focus();
    }, 100);

    this.startTimer();
  }

  isFilled(index: number) {
    return this.otp[index] !== '';
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
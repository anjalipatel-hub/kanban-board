import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  error = '';
  success = '';

  form = this.fb.group({
    mobile: [
      '',
      [Validators.required, Validators.pattern('^[0-9]{10}$')],
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  signup() {
    if (this.form.invalid) {
      this.error = 'Please fill all fields correctly';
      return;
    }

    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    const success = this.auth.signup(this.form.value.mobile!, this.form.value.password!);

    if (!success) {
      this.error = 'User already exists';
    } else {
      this.success = 'Signup successful! Redirecting...';
      setTimeout(() => this.router.navigate(['/login']), 1500);
    }
  }
}
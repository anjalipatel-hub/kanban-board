import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  error = '';

  form = this.fb.group({
    mobile: [
      '',
      [Validators.required, Validators.pattern('^[0-9]{10}$')],
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  login() {
    if (this.form.invalid) {
      this.error = 'Please enter valid credentials';
      return;
    }
    const { mobile, password } = this.form.value;
    const success = this.auth.login(mobile!, password!);

    if (!success) {
      this.error = 'Invalid mobile number or password';
    } else {
      this.router.navigate(['/boards']);
    }
  }
}

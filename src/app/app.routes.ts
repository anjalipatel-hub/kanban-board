import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { AppComponent } from './app.component';
import { authGuard } from './services/auth.guard';
import { BoardsComponent } from './pages/boards/boards.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'boards', component: BoardsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];

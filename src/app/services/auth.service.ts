import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Board } from '../models/board.model';
import { Router } from '@angular/router';

export interface User {
  id: string;
  mobile: string;
  password: string;
  boards: Board[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isBrowser: boolean;
  isLoggedInSignal = signal<boolean>(false);


  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // ✅ Signup with Name + Mobile + Password
  signup(mobile: string, password: string): boolean {
    if (!this.isBrowser) return false;

    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.find((u) => u.mobile === mobile)) {
      return false; // user already exists
    }

    const newUser: User = {
      id: Date.now().toString(),
      mobile,
      password,
      boards: [] // start with no boards
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  }

  login(mobile: string, password: string): boolean {
    if (!this.isBrowser) return false;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const found = users.find(
      (u: any) => u.mobile === mobile && u.password === password
    );

    if (found) {
      localStorage.setItem('currentUser', JSON.stringify(found));
      this.isLoggedInSignal.set(true); // update signal
      return true;
    }
    return false;
  }

  // ✅ Get Current User
  getCurrentUser(): User | null {
    if (!this.isBrowser) return null;
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  }

isLoggedIn(): boolean {
    return this.isLoggedInSignal(); // always reactive
  }

getUserBoards(): Board[] {
  if (!this.isBrowser) return [];
  const currentUser = this.getCurrentUser();
  return currentUser?.boards || [];
}
logout() {
  if (this.isBrowser) {
    localStorage.removeItem('currentUser');
  }
}


saveUserBoards(boards: Board[]): void {
  if (!this.isBrowser) return;
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const currentUser = this.getCurrentUser();

  if (currentUser) {
    const updatedUsers = users.map((u: any) =>
      u.id === currentUser.id ? { ...u, boards } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, boards }));
  }
}

}

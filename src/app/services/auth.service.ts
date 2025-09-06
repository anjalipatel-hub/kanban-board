import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Board } from '../models/board.model';

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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
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

  // ✅ Login with Mobile + Password
  login(mobile: string, password: string): boolean {
    if (!this.isBrowser) return false;

    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const found = users.find((u) => u.mobile === mobile && u.password === password);

    if (found) {
      localStorage.setItem('currentUser', JSON.stringify(found));
      return true;
    }
    return false;
  }

  // ✅ Logout
  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
    }
  }

  // ✅ Get Current User
  getCurrentUser(): User | null {
    if (!this.isBrowser) return null;
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  }

  // ✅ Check Logged In
  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem('currentUser');
  }

getUserBoards(): Board[] {
  if (!this.isBrowser) return [];
  const currentUser = this.getCurrentUser();
  return currentUser?.boards || [];
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

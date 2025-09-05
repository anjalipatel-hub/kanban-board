import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Board } from '../models/board.model';
import { Router } from 'express';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  id: string;
  email: string;
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

  signup(username: string, password: string): boolean {
    if (!this.isBrowser) return false;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find((u: any) => u.username === username)) {
      return false; // user already exists
    }

    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }

  login(username: string, password: string): boolean {
    if (!this.isBrowser) return false;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const found = users.find(
      (u: any) => u.username === username && u.password === password
    );

    if (found) {
      localStorage.setItem('currentUser', JSON.stringify(found));
      return true;
    }
    return false;
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
    }
  }

  getCurrentUser() {
    if (!this.isBrowser) return null;
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem('currentUser');
  }
  }

import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { Board } from '../../models/board.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgClass, NgIf, NgFor, MatMenuModule],
  providers: [AuthService, Router],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Input() opened!: boolean;
  @Input() activeBoard!: Board | null;
  @Input() boards!: Board[];
  @Input() darkMode!: boolean;
  @Output() boardSelect = new EventEmitter<number>();
  @Output() boardAdd = new EventEmitter<void>();
  @Output() boardEdit = new EventEmitter<void>();
  @Output() boardDelete = new EventEmitter<void>();
  @Output() taskAdd = new EventEmitter<void>();

  sidebarShown = false;
  constructor(private AuthService: AuthService, private router: Router) {}

  selectBoard(boardIdx: number): void {
    this.boardSelect.emit(boardIdx);
  }

  addBoard(): void {
    this.boardAdd.emit();
  }

  editBoard(): void {
    this.boardEdit.emit();
  }

  deleteBoard(): void {
    this.boardDelete.emit();
  }

  addTask(): void {
    this.taskAdd.emit();
  }

  open(): void {
    this.sidebarShown = true;
  }

  close(): void {
    this.sidebarShown = false;
  }

  stopPropagation(e: Event) {
    e.stopPropagation();
  }
  logout() {
  this.AuthService.isLoggedInSignal.set(false);
  this.AuthService.logout();
  this.router.navigate(['/login']);  // ✅ this will trigger authGuard on next access
}

}

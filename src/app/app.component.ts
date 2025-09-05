import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { BoardModalComponent } from './components/modals/board-modal/board-modal.component';
import { DeleteModalComponent } from './components/modals/delete-modal/delete-modal.component';
import { TaskModalComponent } from './components/modals/task-modal/task-modal.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProjectBoardComponent } from './components/project-board/project-board.component';
import { SidebarToggleComponent } from './components/sidebar-toggle/sidebar-toggle.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ThemeTogglerComponent } from './components/sidebar/theme-toggler/theme-toggler.component';
import { Board } from './models/board.model';
import { Task } from './models/task.model';
import { BoardDataService } from './services/board-data/board-data.service';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    LoginComponent,
    SignupComponent,
    ThemeTogglerComponent,
    NavbarComponent,
    ProjectBoardComponent,
    SidebarToggleComponent,
    BoardModalComponent,
    DeleteModalComponent,
    TaskModalComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
}

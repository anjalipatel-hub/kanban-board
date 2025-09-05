import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskCardComponent } from './task-card/task-card.component';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Board } from '../../models/board.model';
import { Task } from '../../models/task.model';
import { MatDialog } from '@angular/material/dialog';
import { ViewTaskModalComponent } from '../modals/view-task-modal/view-task-modal.component';
import { TaskOption } from '../../models/modal.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-board',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgStyle,
    NgClass,
    FormsModule,
    TaskCardComponent,
    DragDropModule,
    ViewTaskModalComponent,
  ],
  templateUrl: './project-board.component.html',
  styleUrl: './project-board.component.scss',
})
export class ProjectBoardComponent {
  colors = ['#49C4E5', '#8471F2', '#67E2AE'];

  @Input() activeBoard!: Board | null;
  @Input() darkMode = false;
  @Output() columnAdd = new EventEmitter<void>();
  @Output() boardEdit = new EventEmitter<Board>();
  @Output() taskUpdate = new EventEmitter<{ task: Task; columnName: string }>();
  @Output() taskUpdateModal = new EventEmitter<Task>();
  @Output() taskDeleteModal = new EventEmitter<Task>();

  // Filters
  searchTerm: string = '';
  filterStatus: string = '';
  filterPriority: string = '';
  filterStartDate: string = '';
  filterEndDate: string = ''; 

  // Pagination
  pages: number[] = []; // one page tracker per column
  itemsPerPage: number = 5;

  constructor(private dialog: MatDialog) {}

  ngOnit(): void {
    this.activeBoard = this.activeBoard;
    console.log(this.activeBoard);
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (this.activeBoard) {
      if (event.previousContainer === event.container) {
        moveItemInArray(
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );

        this.boardEdit.emit(this.activeBoard);
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );

        this.boardEdit.emit(this.activeBoard);
      }
    }
  }

  addColumn(): void {
    this.columnAdd.emit();
  }

  viewTask(readTask: Task): void {
    const dialogRef = this.dialog.open(ViewTaskModalComponent, {
      data: {
        task: readTask,
        columns: this.activeBoard?.columns,
        darkMode: this.darkMode,
      },
    });

    dialogRef.afterClosed().subscribe((result: TaskOption) => {
      if (result === TaskOption.Edit) {
        this.taskUpdateModal.emit(readTask);
      } else if (result === TaskOption.Delete) {
        this.taskDeleteModal.emit(readTask);
      } else {
        const updateTask = {
          task: dialogRef.componentInstance.data.task,
          columnName: dialogRef.componentInstance.activeStatus.name,
        };

        this.taskUpdate.emit(updateTask);
      }
    });
  }

  // ✅ Filtering
  getFilteredTasks(tasks: Task[]): Task[] {
    return tasks.filter((task) => {
      const matchesSearch =
        this.searchTerm === '' ||
        task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus =
        this.filterStatus === '' || task.status === this.filterStatus;

      const matchesPriority =
        this.filterPriority === '' || task.priority === this.filterPriority;

      const matchesDateRange =
        (!this.filterStartDate ||
          new Date(task.dueDate) >= new Date(this.filterStartDate)) &&
        (!this.filterEndDate ||
          new Date(task.dueDate) <= new Date(this.filterEndDate));

      return (
        matchesSearch && matchesStatus && matchesPriority && matchesDateRange
      );
    });
  }

  // ✅ Pagination Helpers
  private ensurePage(index: number) {
    if (!this.pages[index]) {
      this.pages[index] = 1;
    }
  }

  getPagedTasks(tasks: Task[], columnIndex: number): Task[] {
    this.ensurePage(columnIndex);
    const page = this.pages[columnIndex];
    const start = (page - 1) * this.itemsPerPage;
    return tasks.slice(start, start + this.itemsPerPage);
  }

  nextPage(total: number, columnIndex: number) {
    this.ensurePage(columnIndex);
    if (this.pages[columnIndex] * this.itemsPerPage < total) {
      this.pages[columnIndex]++;
    }
  }

  prevPage(columnIndex: number) {
    this.ensurePage(columnIndex);
    if (this.pages[columnIndex] > 1) {
      this.pages[columnIndex]--;
    }
  }

  resetFilters(){
    this.searchTerm = '';
    this.filterStatus = '';
    this.filterPriority = '';
    this.filterStartDate = '';
    this.filterEndDate = '';  
  }
}

import { isPlatformBrowser } from '@angular/common';
import {
  Inject,
  Injectable,
  computed,
  effect,
  signal,
} from '@angular/core';
import { Board } from '../../models/board.model';
import { Task } from '../../models/task.model';
import { BoardHttpService } from '../board-http/board-http.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class BoardDataService {
  boards = signal<Board[]>([]);
  currentIdx = signal(0);

  activeBoard = computed(() =>
    this.boards().length > 0 ? this.boards()[this.currentIdx()] : null
  );

  constructor(private auth: AuthService) {}

  getBoards(): void {
    const userBoards = this.auth.getUserBoards();
    this.boards.set(userBoards);
  }

  private persist() {
    this.auth.saveUserBoards(this.boards());
  }

  selectBoard(boardIdx: number) {
    this.currentIdx.set(boardIdx);
  }

  addBoard(board: Board): void {
    this.boards.update((boards) => [...boards, board]);
    this.selectBoard(this.boards().length - 1);
    this.persist();
  }

  editBoard(updatedBoard: Board) {
    this.boards.update((boards) =>
      boards.map((board) =>
        board === this.activeBoard() ? { ...updatedBoard } : board
      )
    );
    this.persist();
  }

  deleteBoard() {
    this.boards.update((boards) =>
      boards.filter((board) => board !== this.activeBoard())
    );
    if (this.boards().length >= 1) this.selectBoard(0);
    this.persist();
  }

  addTask(task: Task) {
    this.boards.update((boards) =>
      boards.map((board) =>
        board === this.activeBoard()
          ? {
              ...board,
              columns: board.columns.map((column) => ({
                ...column,
                tasks:
                  column.name === task.status
                    ? [...column.tasks, task]
                    : column.tasks,
              })),
            }
          : board
      )
    );
    this.persist();
  }

  updateTask(updateTask: { task: Task; columnName: string }) {
    const currentColumnName = this.activeBoard()
      ?.columns.map((column) => ({
        ...column,
        tasks: column.tasks.filter(
          (task) => task.title === updateTask.task.title
        ),
      }))
      .filter((column) => column.tasks.length > 0)
      .map((column) => column.name)[0];

    this.boards.update((boards) =>
      boards.map((board) => {
        if (board === this.activeBoard()) {
          if (currentColumnName === updateTask.columnName) {
            return {
              ...board,
              columns: board.columns.map((column) => ({
                ...column,
                tasks: column.tasks.map((task) =>
                  task.title === updateTask.task.title
                    ? { ...updateTask.task }
                    : task
                ),
              })),
            };
          } else {
            return {
              ...board,
              columns: board.columns.map((column) => {
                if (column.name === updateTask.columnName) {
                  return {
                    ...column,
                    tasks: [...column.tasks, updateTask.task],
                  };
                } else if (column.name === currentColumnName) {
                  return {
                    ...column,
                    tasks: column.tasks.filter(
                      (task) => task.title !== updateTask.task.title
                    ),
                  };
                } else {
                  return column;
                }
              }),
            };
          }
        }
        return board;
      })
    );
    this.persist();
  }

  deleteTask(deleteTask: Task) {
    this.boards.update((boards) =>
      boards.map((board) =>
        board === this.activeBoard()
          ? {
              ...board,
              columns: board.columns.map((column) => ({
                ...column,
                tasks: column.tasks.filter((task) => task !== deleteTask),
              })),
            }
          : board
      )
    );
    this.persist();
  }
}
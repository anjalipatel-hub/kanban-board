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

@Injectable({
  providedIn: 'root',
})
export class BoardDataService {
  // store all boards
  boards = signal<Board[]>([]);

  // currently selected board index
  currentIdx = signal(0);

  // derived signal for active board
  activeBoard = computed(() =>
    this.boards().length > 0 ? this.boards()[this.currentIdx()] : null
  );

  constructor(private boardHttp: BoardHttpService) {}

  // ✅ Fetch boards from assets/data.json
  getBoards(): void {
    this.boardHttp.getBoards().subscribe({
      next: (res: { boards: Board[] }) => {
        this.boards.set(res.boards);
      },
      error: (err) => console.error('Failed to load boards', err),
    });
  }

  // ✅ Switch active board
  selectBoard(boardIdx: number): void {
    this.currentIdx.set(boardIdx);
  }

  // ✅ Add new board
  addBoard(board: Board): void {
    this.boards.update((boards) => [...boards, board]);
    this.selectBoard(this.boards().length - 1);
  }

  // ✅ Edit existing board
  editBoard(updatedBoard: Board): void {
    this.boards.update((boards) =>
      boards.map((board, idx) =>
        idx === this.currentIdx() ? { ...updatedBoard } : board
      )
    );
  }

  // ✅ Delete active board
  deleteBoard(): void {
    this.boards.update((boards) =>
      boards.filter((_, idx) => idx !== this.currentIdx())
    );

    if (this.boards().length > 0) {
      this.selectBoard(0);
    } else {
      this.currentIdx.set(0);
    }
  }

  // ✅ Add task to active board
  addTask(task: Task): void {
    this.boards.update((boards) =>
      boards.map((board, idx) =>
        idx === this.currentIdx()
          ? {
              ...board,
              columns: board.columns.map((col) =>
                col.name === task.status
                  ? { ...col, tasks: [...col.tasks, task] }
                  : col
              ),
            }
          : board
      )
    );
  }

  // ✅ Update task (move or edit)
  updateTask(updateTask: { task: Task; columnName: string }): void {
    this.boards.update((boards) =>
      boards.map((board, idx) => {
        if (idx !== this.currentIdx()) return board;

        // remove from old column
        const updatedColumns = board.columns.map((col) => ({
          ...col,
          tasks: col.tasks.filter((t) => t.title !== updateTask.task.title),
        }));

        // add into new column
        return {
          ...board,
          columns: updatedColumns.map((col) =>
            col.name === updateTask.columnName
              ? { ...col, tasks: [...col.tasks, updateTask.task] }
              : col
          ),
        };
      })
    );
  }

  // ✅ Delete task
  deleteTask(deleteTask: Task): void {
    this.boards.update((boards) =>
      boards.map((board, idx) =>
        idx === this.currentIdx()
          ? {
              ...board,
              columns: board.columns.map((col) => ({
                ...col,
                tasks: col.tasks.filter((t) => t.title !== deleteTask.title),
              })),
            }
          : board
      )
    );
  }

}
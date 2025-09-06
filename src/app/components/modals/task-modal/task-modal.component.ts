import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { Column } from '../../../models/column.model';
import { Task } from '../../../models/task.model';
import { SubTask } from '../../../models/subTask.model';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, ReactiveFormsModule, MatMenuModule],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss',
})
export class TaskModalComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  form!: FormGroup;
  opened = false;

  // Define priorities array
  priorities: string[] = ['High', 'Medium', 'Low'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      task: Task;
      darkMode: boolean;
      columns: Column[];
      editMode: boolean;
    }
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

 buildForm() {
  const defaultPriority = this.priorities.includes(this.data.task?.priority)
    ? this.data.task.priority
    : 'Medium';

  this.form = this.fb.nonNullable.group({
    title: this.fb.control(this.data.task?.title || '', { validators: [Validators.required] }),
    description: this.fb.control(this.data.task?.description || ''),
    status: this.fb.control(this.data.task?.status || this.data.columns[0].name, { validators: [Validators.required] }),
    subtasks: this.fb.array([]),
    priority: this.fb.control(defaultPriority, { validators: [Validators.required] })
  });

  // Populate subtasks
  if (this.data.task?.subtasks?.length > 0) {
    this.data.task.subtasks.forEach((subtask) => this.addSubtask(subtask));
  } else {
    this.addSubtask();
  }
}


  get subTaskArray() {
    return this.form.get('subtasks') as FormArray;
  }

  addSubtask(subtask: SubTask = { title: '', isCompleted: false }) {
    const group = this.fb.nonNullable.group({
      isCompleted: subtask.isCompleted,
      title: [subtask.title, Validators.required],
    });
    this.subTaskArray.push(group);
  }

  removeSubtask(index: number): void {
    this.subTaskArray.removeAt(index);
  }

  openDropdown(): void {
    this.trigger.openMenu();
  }

  open(): void {
    this.opened = true;
  }

  close(): void {
    this.opened = false;
  }

  submit() {
    const editMode = this.data.editMode;

    if (editMode) {
      const updatedTask: Task = {
        ...this.data.task,
        ...this.form.value,
      };
      this.dialogRef.close(updatedTask);
    } else {
      this.dialogRef.close(this.form.value);
    }
  }
}
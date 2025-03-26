// src/app/components/task-list/task-list.component.ts

import { Component, OnInit } from '@angular/core';
import { TaskService } from '@services/task.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from '@components/task-dialog/task-dialog.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: false
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];

  constructor(private taskService: TaskService, public dialog: MatDialog) { }

  ngOnInit(): void {
    // Load tasks from the server
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data;
    });

    // Listen for real-time updates
    this.taskService.getTaskUpdates().subscribe(update => {
      const { type, task, id } = update;
      if (type === 'added') {
        this.tasks.push(task);
      } else if (type === 'updated') {
        this.tasks = this.tasks.map(t => t._id === task._id ? task : t);
      } else if (type === 'deleted') {
        this.tasks = this.tasks.filter(t => t._id !== id);
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '300px',
      data: { title: '', completed: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.addTask(result).subscribe();
      }
    });
  }

  openEditDialog(task: any): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '300px',
      data: { ...task }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.updateTask(result).subscribe();
      }
    });
  }

  deleteTask(task: any): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(task._id).subscribe();
    }
  }
}

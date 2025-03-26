// src/app/services/task.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/api/tasks';
  private socket = io('http://localhost:3000');
  private updates$ = new Subject<any>();

  constructor(private http: HttpClient) {
    this.socket.on('taskAdded', task => this.updates$.next({ type: 'added', task }));
    this.socket.on('taskUpdated', task => this.updates$.next({ type: 'updated', task }));
    this.socket.on('taskDeleted', (id: string) => this.updates$.next({ type: 'deleted', id }));
  }

  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addTask(task: any): Observable<any> {
    return this.http.post(this.apiUrl, task);
  }

  updateTask(task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${task._id}`, task);
  }

  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${taskId}`);
  }

  getTaskUpdates(): Observable<any> {
    return this.updates$.asObservable();
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Child, Todo } from '../child/child';

@Component({
  selector: 'app-parent',
  imports: [CommonModule, FormsModule, Child],
  templateUrl: './parent.html',
  styleUrl: './parent.css'
})
export class Parent {
  // Parent component's data (will be sent to children via @Input)
  todos: Todo[] = [
    { id: 1, title: 'Learn Angular @Input decorator', completed: false, priority: 'high' },
    { id: 2, title: 'Understand @Output and EventEmitter', completed: false, priority: 'medium' },
    { id: 3, title: 'Build component communication demo', completed: true, priority: 'low' },
    { id: 4, title: 'Master parent-child data flow', completed: false, priority: 'high' }
  ];

  // Parent component's settings (also sent via @Input)
  canEditTodos: boolean = true;
  currentTheme: string = 'light';
  nextTodoId: number = 5;

  // Form data for adding new todos
  newTodoTitle: string = '';
  newTodoPriority: 'low' | 'medium' | 'high' = 'medium';

  // Communication logs for demonstration
  communicationLogs: string[] = [];

  // 📤 Methods to handle @Output events from children
  onTodoCompleted(todo: Todo) {
    // Handle the completed event from child
    const todoIndex = this.todos.findIndex(t => t.id === todo.id);
    if (todoIndex !== -1) {
      this.todos[todoIndex] = { ...todo };
      this.addLog(`📥 Received todoCompleted event: "${todo.title}" is now ${todo.completed ? 'completed' : 'pending'}`);
    }
  }

  onTodoDeleted(todoId: number) {
    // Handle the delete event from child
    const todoIndex = this.todos.findIndex(t => t.id === todoId);
    if (todoIndex !== -1) {
      const deletedTodo = this.todos[todoIndex];
      this.todos.splice(todoIndex, 1);
      this.addLog(`📥 Received todoDeleted event: Deleted "${deletedTodo.title}" (ID: ${todoId})`);
    }
  }

  onPriorityChanged(event: {id: number, newPriority: string}) {
    // Handle the priority change event from child
    const todoIndex = this.todos.findIndex(t => t.id === event.id);
    if (todoIndex !== -1) {
      this.todos[todoIndex].priority = event.newPriority as 'low' | 'medium' | 'high';
      this.addLog(`📥 Received priorityChanged event: Todo ID ${event.id} priority changed to ${event.newPriority}`);
    }
  }

  // Parent component methods
  addNewTodo() {
    if (this.newTodoTitle.trim()) {
      const newTodo: Todo = {
        id: this.nextTodoId++,
        title: this.newTodoTitle.trim(),
        completed: false,
        priority: this.newTodoPriority
      };
      
      this.todos.push(newTodo);
      this.addLog(`📤 Parent created new todo: "${newTodo.title}" with ${newTodo.priority} priority`);
      
      // Reset form
      this.newTodoTitle = '';
      this.newTodoPriority = 'medium';
    }
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.addLog(`📤 Parent changed theme to: ${this.currentTheme}`);
  }

  toggleEditMode() {
    this.canEditTodos = !this.canEditTodos;
    this.addLog(`📤 Parent ${this.canEditTodos ? 'enabled' : 'disabled'} edit mode`);
  }

  clearAllTodos() {
    const count = this.todos.length;
    this.todos = [];
    this.addLog(`📤 Parent cleared all todos (${count} items removed)`);
  }

  resetTodos() {
    this.todos = [
      { id: 1, title: 'Learn Angular @Input decorator', completed: false, priority: 'high' },
      { id: 2, title: 'Understand @Output and EventEmitter', completed: false, priority: 'medium' },
      { id: 3, title: 'Build component communication demo', completed: true, priority: 'low' },
      { id: 4, title: 'Master parent-child data flow', completed: false, priority: 'high' }
    ];
    this.nextTodoId = 5;
    this.addLog(`📤 Parent reset todos to initial state`);
  }

  clearLogs() {
    this.communicationLogs = [];
  }

  // Helper method to add communication logs
  private addLog(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.communicationLogs.unshift(`[${timestamp}] ${message}`);
    
    // Keep only last 20 logs
    if (this.communicationLogs.length > 20) {
      this.communicationLogs = this.communicationLogs.slice(0, 20);
    }
  }

  // Getter methods for stats
  get completedCount(): number {
    return this.todos.filter(todo => todo.completed).length;
  }

  get pendingCount(): number {
    return this.todos.filter(todo => !todo.completed).length;
  }

  get totalCount(): number {
    return this.todos.length;
  }

  // Track by function for *ngFor performance optimization
  trackByTodoId(index: number, todo: Todo): number {
    return todo.id;
  }
}

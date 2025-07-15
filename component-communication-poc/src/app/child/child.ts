import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// Define the shape of our todo data
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

@Component({
  selector: 'app-child',
  imports: [CommonModule],
  templateUrl: './child.html',
  styleUrl: './child.css'
})
export class Child {
  // 📥 @Input: Receives data FROM parent
  @Input() todo!: Todo;           // Required todo item
  @Input() canEdit: boolean = false;  // Optional editing permission
  @Input() theme: string = 'light';   // Optional theme setting

  
  // 📤 @Output: Sends events TO parent
  @Output() todoCompleted = new EventEmitter<Todo>();  // When todo is marked complete
  @Output() todoDeleted = new EventEmitter<number>();  // When todo is deleted (send ID)
  @Output() priorityChanged = new EventEmitter<{id: number, newPriority: string}>(); // When priority changes

  // Component methods that trigger outputs
  onToggleComplete() {
    // Update the todo locally
    this.todo.completed = !this.todo.completed;
    
    // 📤 Emit event to parent with updated todo
    this.todoCompleted.emit(this.todo);
  }

  onDeleteTodo() {
    // 📤 Emit delete event to parent with todo ID
    this.todoDeleted.emit(this.todo.id);
  }

  onPriorityChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const newPriority = target.value;
    
    // 📤 Emit priority change event to parent
    this.priorityChanged.emit({
      id: this.todo.id,
      newPriority: newPriority
    });
  }

  // Helper method to get priority color
  getPriorityColor(): string {
    switch(this.todo.priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#95a5a6';
    }
  }
}

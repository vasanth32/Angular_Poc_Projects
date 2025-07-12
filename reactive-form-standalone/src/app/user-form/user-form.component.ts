import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ValidationErrors, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {

  bannedUsernames = ['admin', 'root', 'superuser'];
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      userInfo: this.fb.group({
        username: ['', [Validators.required, Validators.minLength(3), this.forbiddenNamesValidator.bind(this)]],
        email: ['', [Validators.required, Validators.email]]
      }),
      address: this.fb.group({
        city: ['', Validators.required],
        zip: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]]
      })
    });
  }

  forbiddenNamesValidator(control: AbstractControl): ValidationErrors | null {
    const name = control.value?.toLowerCase();
    return this.bannedUsernames.includes(name) ? { forbiddenName: true } : null;
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      console.log('Form Submitted:', this.userForm.value);
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}

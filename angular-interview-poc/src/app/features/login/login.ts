import { Component } from '@angular/core';
import { FormsModule  } from '@angular/forms';

@Component({
  imports: [FormsModule ],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  username = "";
}

import { Component } from '@angular/core';
import { DebouncedSearchComponent } from './debounced-search/debounced-search.component';

@Component({
  selector: 'app-root',
  imports: [DebouncedSearchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'debounced-search-poc';
}

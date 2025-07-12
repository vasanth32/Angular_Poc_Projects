import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime, switchMap, catchError, takeUntil, distinctUntilChanged, map } from 'rxjs/operators';
import { of } from 'rxjs';

// Interface for API response
interface ApiEntry {
  API: string;
  Description: string;
  Auth: string;
  HTTPS: boolean;
  Cors: string;
  Link: string;
  Category: string;
}

interface ApiResponse {
  count: number;
  entries: ApiEntry[];
}

@Component({
  selector: 'app-debounced-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './debounced-search.component.html',
  styleUrl: './debounced-search.component.css'
})
export class DebouncedSearchComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  
  // Component state
  results: ApiEntry[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  showDebugInfo = false; // Toggle for debug info
  
  // RxJS cleanup
  private destroy$ = new Subject<void>();
  
  constructor(private http: HttpClient) {}

  ngOnInit() {
    console.log('🎯 DebouncedSearchComponent initialized');
  }

  ngAfterViewInit() {
    // This is where the magic happens! 🪄
    this.setupDebouncedSearch();
  }

  private setupDebouncedSearch() {
    // Create observable from input events
    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(
        // 🔥 CONCEPT 1: Extract the input value
        map((event: Event) => (event.target as HTMLInputElement).value),
        
        // 🔥 CONCEPT 2: Debounce - wait 300ms after user stops typing
        debounceTime(300),
        
        // 🔥 CONCEPT 3: Only proceed if value actually changed
        distinctUntilChanged(),
        
        // 🔥 CONCEPT 4: Show loading and update search term
        map(term => {
          this.searchTerm = term.trim();
          this.isLoading = !!this.searchTerm;
          this.errorMessage = '';
          
          console.log('🔍 Searching for:', this.searchTerm);
          return this.searchTerm;
        }),
        
        // 🔥 CONCEPT 5: SwitchMap - cancel previous request and start new one
        switchMap(term => {
          if (!term) {
            this.results = [];
            this.isLoading = false;
            return of(null);
          }
          
          // Make HTTP request to public API
          return this.searchApis(term);
        }),
        
        // 🔥 CONCEPT 6: Error handling
        catchError(error => {
          console.error('❌ Search error:', error);
          this.errorMessage = 'Failed to search APIs. Please try again.';
          this.isLoading = false;
          return of(null);
        }),
        
        // 🔥 CONCEPT 7: Clean unsubscribe
        takeUntil(this.destroy$)
      )
      .subscribe(response => {
        this.isLoading = false;
        
        if (response && response.entries) {
          this.results = response.entries;
          console.log('✅ Found', this.results.length, 'results');
        } else if (response === null && this.searchTerm) {
          this.results = [];
        }
      });
  }

  private searchApis(term: string) {
    const apiUrl = `https://api.publicapis.org/entries?title=${encodeURIComponent(term)}`;
    
    return this.http.get<ApiResponse>(apiUrl)
      .pipe(
        catchError(error => {
          throw new Error(`API request failed: ${error.message}`);
        })
      );
  }

  // Toggle debug info for learning purposes
  toggleDebugInfo() {
    this.showDebugInfo = !this.showDebugInfo;
  }

  ngOnDestroy() {
    // 🔥 CONCEPT 8: Cleanup to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
    console.log('🧹 DebouncedSearchComponent cleaned up');
  }
}

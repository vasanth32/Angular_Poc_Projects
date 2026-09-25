import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";

export interface LoginResponse {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private http = inject(HttpClient);

  private userSubject = new BehaviorSubject<LoginResponse | null>(null);

  user$ = this.userSubject.asObservable();

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>("https://dummyjson.com/auth/login", {
        username,
        password,
        expiresInMins: 30,
      })
      .pipe(
        tap((user) => {
          localStorage.setItem("accessToken", user.accessToken);
          this.userSubject.next(user);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem("accessToken");
    this.userSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem("accessToken");
  }

  getToken(): string | null {
    return localStorage.getItem("accessToken");
  }
}

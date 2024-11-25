import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   
  baseURL = 'http://localhost:5007/api';

  constructor(private http: HttpClient) {}

  createUser(formData: any) {
    return this.http.post(`${this.baseURL}/signup`, formData);
  }

  isLoggedIn() {
    return this.getToken() != null;
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.removeItem('token');
  }

  getClaims() {
    const token = this.getToken();
    if (!token) return null; // Return null if no token exists
    return JSON.parse(window.atob(token.split('.')[1]));
  }
 
}

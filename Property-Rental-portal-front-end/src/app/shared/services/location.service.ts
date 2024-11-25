import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private apiUrl = 'https://nominatim.openstreetmap.org';

  constructor(private http: HttpClient) {}


  getStates(county: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/states?county=${county}`);
  }

  getCities(state: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cities?state=${state}`);
  }
}

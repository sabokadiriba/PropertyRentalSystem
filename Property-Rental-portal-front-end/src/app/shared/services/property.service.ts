import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  
 
 

  constructor(private http:HttpClient,private authService:AuthService) { 

  }
  baseURL = 'http://localhost:5202/api';

  createPropert(formData:any){
    return this.http.post(this.baseURL+'/Properties/CreateProperty',formData);
  }
  getProperties(): Observable<any[]> {
    
    return this.http.get<any[]>(`${this.baseURL}/Properties/GetProperties`);
  }
  getPropertyById(id: string) {
    return this.http.get<any>(`${this.baseURL}/Properties/GetProperty/${id}`);
  }
  
  updateProperty(id: string, property: any) {
    return this.http.put<any>(`${this.baseURL}/properties/UpdateProperty/${id}`, property);
  }
  deleteProperty(id: number) {
    return this.http.delete<any>(`${this.baseURL}/properties/DeleteProperty/${id}`);
  }
  
  GetRentRequestByPropertyId(propertyId: number) {
    return this.http.get<any>(`${this.baseURL}/RentRequest/GetRentRequestByPropertyId/${propertyId}`);
  }
 
}
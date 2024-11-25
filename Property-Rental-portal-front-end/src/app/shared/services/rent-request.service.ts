import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface RentRequestCreateDTO {
  propertyId: number;
  
}

@Injectable({
  providedIn: 'root',
})
export class RentRequestService {
 

  baseURL = 'http://localhost:5202/api';
  constructor(private http: HttpClient) {}

  // Fetch list of available properties
  getAvailableProperties(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseURL}/Properties/GetProperties`);
  }
  // Create a rent request
  createRentRequest(rentRequestDTO: RentRequestCreateDTO): Observable<any> {
    
    return this.http.post(this.baseURL+'/RentRequest/CreateRentRequest',rentRequestDTO);
  }
  getRentRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseURL}/RentRequest/GetAllRentRequests`);  
  }
  shareContact(id: number) {
    return this.http.post(this.baseURL +`/RentRequest/ShareContact/${id}`,{});
}  
followUp(id: number) {
  return this.http.post(this.baseURL +`/RentRequest/FollowUp/${id}`,{});
}

}

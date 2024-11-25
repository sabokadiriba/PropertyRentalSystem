import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

 // Service to get the user role (if needed)

 @Component({
  selector: 'app-dashboard',
  standalone:true,
  imports:[CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent{
  
  constructor(
   
  ) {}

}
import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PropertyService } from 'src/app/shared/services/property.service';
import { RentRequestService } from 'src/app/shared/services/rent-request.service';
import { FormsModule } from '@angular/forms';  // Import FormsModule

@Component({
  selector: 'app-rent-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,FormsModule],
  templateUrl: './rent-request.component.html',
  styleUrl: './rent-request.component.scss'
})
export class RentRequestComponent implements OnInit {
  properties = [];  // Store the list of properties
  errorMessage: string;  // To show error messages if any
  showCreateRequestModal = false;  // To control modal visibility
  selectedPropertyId: number;  // To store selected property ID for the rent request
  searchQuery: string = '';  // For storing the search query

  constructor(private rentRequestService: RentRequestService) {}  // Inject RentRequestService

  ngOnInit(): void {
    this.loadProperties();  // Load properties on component init
  }

  // Fetch the list of available properties
  loadProperties(): void {
    this.rentRequestService.getAvailableProperties().subscribe(
      (data: any[]) => {
        this.properties = data;
      },
      (error) => {
        this.errorMessage = 'Failed to load properties';
      }
    );
  }

  // Filter properties based on search query
  filteredProperties() {
    if (!this.searchQuery) {
      return this.properties;
    }
    return this.properties.filter(property =>
      property.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      property.propertyType.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      property.county.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      property.state.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Open modal to confirm the creation of the rent request
  openCreateRentRequestModal(propertyId: number): void {
    this.selectedPropertyId = propertyId;
    this.showCreateRequestModal = true;  // Show the modal
  }

  // Close the rent request creation modal
  closeCreateRentRequestModal(): void {
    this.showCreateRequestModal = false;  // Hide the modal
    this.selectedPropertyId = null;  // Clear selected property ID
  }

  // Send the request to create a rent request to the backend
  createRentRequest(): void {
    const seekerId = '0a728dd2-82b4-440d-8f6a-d2fd2e1d9196';  // Replace with actual seeker ID logic for the current user
    const requestData = {
      propertyId: this.selectedPropertyId,
    };

    this.rentRequestService.createRentRequest(requestData).subscribe(
      () => {
        alert('Rent request created successfully!');
        this.closeCreateRentRequestModal();  // Close the modal after successful creation
        this.loadProperties();  // Reload the list of properties after the request is created
      },
      (error) => {
        alert('Failed to create rent request.');
        this.closeCreateRentRequestModal();  // Close the modal even if the request fails
      }
    );
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PropertyService } from 'src/app/shared/services/property.service'; // Import your property service

@Component({
  selector: 'app-view-property',
  standalone:true,
  imports:[CommonModule],
  templateUrl: './view-property.component.html',
  styleUrls: ['./view-property.component.scss']
})
export class ViewPropertyComponent implements OnInit {
  properties: any[] = [];
  errorMessage: string | null = null;
  showDeleteModal: boolean = false;
  propertyToDelete: number | null = null;
  requests: any[] = [];
  showViewRequestModal: boolean = false;
  selectedPropertyRequests: any[] = [];
  selectedPropertyId: number | null = null;
  loading: boolean = false;
  selectedRequestId: number;
  constructor(private propertyService: PropertyService,private router:Router) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  // Method to load properties from the service
  loadProperties() {
    this.propertyService.getProperties().subscribe({
      next: (data: any[]) => {
        this.properties = data; // Assign the response to the properties array
      },
      error: (err) => {
        if (err.status === 404) {
          // Handle 'Not Found' error
          this.errorMessage = 'Property not found.';
        } else {
          // Handle other errors
          this.errorMessage = 'There was an error fetching the property list.';
        }
      }
    });
  }
  navigateToAddProperty() {
    this.router.navigate(['/add-property']); // Navigate to Add Property component
  }
  navigateToUpdateProperty(propertyId: number) {
    this.router.navigate([`/update-property/${propertyId}`]); // Navigate to Update Property component
  }
  openDeleteModal(propertyId: number) {
    this.propertyToDelete = propertyId;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.propertyToDelete = null;
    this.showDeleteModal = false;
  }
  confirmDelete() {
    if (this.propertyToDelete !== null) {
      this.propertyService.deleteProperty(this.propertyToDelete).subscribe({
        next: () => {
          // Remove the deleted property from the list
          this.properties = this.properties.filter(
            (property) => property.propertyId !== this.propertyToDelete
          );
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error('Error deleting property:', err);
          this.errorMessage = 'There was an error deleting the property.';
        },
      });
    }
  }

  navigateToDeleteProperty(propertyId: number) {
    const confirmed = window.confirm('Are you sure you want to delete this property?');
    if (confirmed) {
      this.propertyService.deleteProperty(propertyId).subscribe({
        next: () => {
          // Reload properties after successful deletion
          this.loadProperties();
          alert('Property deleted successfully.');
        },
        error: (err) => {
          console.error('Error deleting property:', err);
          alert('An error occurred while deleting the property.');
        }
      });
    }
  }
  
  openViewRequestModal(propertyId: number): void {
    this.propertyService.GetRentRequestByPropertyId(propertyId)
      .subscribe({
        next: (data: any) => {
          this.selectedPropertyRequests = data; // Bind fetched requests
          console.log(this.selectedPropertyRequests)
          this.showViewRequestModal = true; // Show the modal
        },
        error: (err) => {
          if (err.status === 404) {
            // Handle 'Not Found' error
            this.selectedPropertyRequests = []; // Clear requests
            this.showViewRequestModal = true; // Show modal to display "No requests yet"
          } else {
            // Handle other errors
            alert('Unable to load requests for this property.');
          }
        }
      });
  }
  

  closeViewRequestModal() {
    this.showViewRequestModal = false;
    this.selectedPropertyRequests = []; // Clear data when modal closes
  }

}
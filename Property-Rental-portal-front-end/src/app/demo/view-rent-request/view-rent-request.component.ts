import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RentRequestService } from 'src/app/shared/services/rent-request.service';

@Component({
  selector: 'app-view-rent-request',
  standalone: true,
  imports: [CommonModule,CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './view-rent-request.component.html',
  styleUrl: './view-rent-request.component.scss'
})
export class ViewRentRequestComponent  implements OnInit {
  rentRequests: any[] = [];
  errorMessage: string | null = null;
  showShareContactModal: boolean = false;
  showFollowUpModal: boolean = false;
  selectedRequestId: number | null = null;


  constructor(private rentRequestService: RentRequestService) {}

  ngOnInit(): void {
    this.loadRentRequests();
  }

  loadRentRequests(): void {
    
    this.rentRequestService.getRentRequests().subscribe(
      (data) => {
        this.rentRequests = data;
      },
      (error) => {
        this.errorMessage = 'Failed to load rent requests.';
        console.error(error);
      }
    );
  }
  openShareContactModal(rentRequestId: number) {
    this.selectedRequestId = rentRequestId; // Store the selected Rent Request ID
    this.showShareContactModal = true; // Show the modal
  }

  closeShareContactModal() {
    this.showShareContactModal = false; // Hide the modal
  }

  confirmShareContact() {
    if (this.selectedRequestId) {
      this.rentRequestService.shareContact(this.selectedRequestId).subscribe(
        () => {
          console.log("Contact shared successfully.");
          this.closeShareContactModal(); // Close the modal after the contact is shared
          // Optionally, you can update the local list of rent requests here
        },
        (error) => {
          console.error("Error sharing contact:", error);
          this.errorMessage = "An error occurred while sharing the contact.";
        }
      );
    }
  }
  openFollowUpModal(rentRequestId: number) {
    this.selectedRequestId = rentRequestId; // Store the selected Rent Request ID
    this.showFollowUpModal = true; // Show the modal
  }

  closeFollowUpModal() {
    this.showFollowUpModal = false; // Hide the modal
  }

  confirmFollowUp() {
    if (this.selectedRequestId) {
      this.rentRequestService.followUp(this.selectedRequestId).subscribe(
        () => {
          
          this.closeFollowUpModal(); // Close the modal after the contact is shared
          // Optionally, you can update the local list of rent requests here
        },
        (error) => {
          console.error("Error sharing contact:", error);
          this.errorMessage = "An error occurred while sharing the contact.";
        }
      );
    }
  }
   // Determines if the "Follow Up" button should be disabled
   isFollowUpDisabled(requestDate: Date, isContactShared: boolean): boolean {
    if (!isContactShared) {
      return true; // Cannot follow up if contact is not shared
    }
    const now = new Date();
    const requestTimePlus24Hours = new Date(requestDate);
    requestTimePlus24Hours.setHours(requestTimePlus24Hours.getHours() + 24);
    return now < requestTimePlus24Hours; // Disable if 24 hours have not passed
  }
 
  
  }
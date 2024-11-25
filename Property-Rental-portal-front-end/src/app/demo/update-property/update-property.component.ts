import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PropertyService } from 'src/app/shared/services/property.service';

@Component({
  selector: 'app-update-property',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-property.component.html',
  styleUrls: ['./update-property.component.scss']
})
export class UpdatePropertyComponent implements OnInit {
  form: FormGroup;
  isSubmitted = false;
  errorMessage: string | null = null;
  isSuccess = false;
  propertyId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Initialize the form
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      propertyType: ['', [Validators.required, Validators.maxLength(50)]],
      county: ['', Validators.maxLength(100)],
      city: ['', [Validators.required, Validators.maxLength(100)]],
      state: ['', [Validators.required, Validators.maxLength(50)]],
      price: [
        '',
        [Validators.required, Validators.min(0), Validators.pattern('^\\d+(\\.\\d{1,2})?$')]
      ],
      bedrooms: [null, [Validators.required, Validators.min(1)]],
      bathrooms: [null, [Validators.required, Validators.min(1)]],
      isAvailable: [false],
      parkingIncluded: [false], // Parking availability
      petsAllowed: [false], // Pets allowed
      furnished: ['', [Validators.maxLength(50)]], // Furnished status (e.g., Fully, Semi, None)
      availability: ['', [Validators.maxLength(50)]], // Availability status (e.g., Immediate, Later)
      additionalNotes: ['', [Validators.maxLength(500)]] // Additional notes
 
    });
  }

  ngOnInit(): void {
    // Get the property ID from the route parameters
    this.propertyId = this.route.snapshot.paramMap.get('id');
    if (this.propertyId) {
      this.loadPropertyDetails(this.propertyId);
    }
  }

  loadPropertyDetails(propertyId: string): void {
    this.propertyService.getPropertyById(propertyId).subscribe({
      next: (property) => {
        this.form.patchValue(property);
      },
      error: (err) => {
        console.error('Error loading property details:', err);
        this.errorMessage = 'Failed to load property details.';
      }
    });
  }

  onSubmit(): void {
    this.isSubmitted = true;
    this.errorMessage = null;
    this.isSuccess = false;
    
    if (this.form.valid && this.propertyId) {
      this.propertyService.updateProperty(this.propertyId, this.form.value).subscribe({
        next: () => {
          
            this.isSuccess = true;
            this.router.navigate(['/view-property']); // Navigate to the property list or a success page
          
        },
        error: (err) => {
          console.error('Error updating property:', err);
          this.errorMessage = 'An error occurred while updating the property.';
        }
      });
    }
  }
   // Display error message for specific form control
   hasError(controlName: string, errorCode: string): boolean {
    const control = this.form.get(controlName);
    return control?.hasError(errorCode) && (this.isSubmitted || control?.touched || control?.dirty);
  }

  hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control?.invalid && (this.isSubmitted || control?.touched || control?.dirty);
  }
}

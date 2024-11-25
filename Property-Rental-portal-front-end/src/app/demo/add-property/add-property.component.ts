import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PropertyService } from 'src/app/shared/services/property.service';

@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './add-property.component.html',
  styleUrl: './add-property.component.scss'
})
export class AddPropertyComponent {
  form: FormGroup;
  isSubmitted = false;
  errorMessage: string | null = null;
  isSuccess = false;

  constructor(private fb: FormBuilder, private propertyService: PropertyService, private router:Router) {
    // Initialize the form with validation rules
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
      bedrooms: ['', [Validators.required, Validators.min(1)]],
      bathrooms: ['', [Validators.required, Validators.min(1)]],
      isAvailable: [false],
      parkingIncluded: [false], // Parking availability
      petsAllowed: [false], // Pets allowed
      furnished: ['', [Validators.maxLength(50)]], // Furnished status (e.g., Fully, Semi, None)
      availability: ['', [Validators.maxLength(50)]], // Availability status (e.g., Immediate, Later)
      additionalNotes: ['', [Validators.maxLength(500)]] // Additional notes
    });
  }

  // Submit handler
  onSubmit() {
    this.isSubmitted = true;
    this.errorMessage = null;
    this.isSuccess = false;

    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
      this.propertyService.createPropert(this.form.value).subscribe({
        next: (res: any) => {
          if (res.propertyId) {
            this.isSuccess = true;
            this.form.reset();
            this.isSubmitted = false;
            this.router.navigate(['/view-property']);

          }
        },
        error: (err) => {
          console.error('Error:', err);
          this.errorMessage = 'An error occurred while processing your request.';
        }
      });
    } else {
      console.warn('Form is invalid:', this.form.errors);
    }
  }

  // Display error message for specific form control
  hasError(controlName: string, errorCode: string): boolean {
    const control = this.form.get(controlName);
    return control?.hasError(errorCode) && (this.isSubmitted || control?.touched || control?.dirty);
  }

  // Display a general error for any invalid field
  hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control?.invalid && (this.isSubmitted || control?.touched || control?.dirty);
  }
  navigateToAddProperty() {
    this.router.navigate(['/add-property']); // Navigate to Add Property component
  }
}

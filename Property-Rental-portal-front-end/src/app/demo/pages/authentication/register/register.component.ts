import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirstKeyPipe } from 'src/app/shared/pipes/first-key.pipe';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, FirstKeyPipe, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export default class RegisterComponent {
  isSubmitted: boolean = false;
  baseURL = 'http://localhost:5202/api';
  errorMessage: string | null = null;
  isSuccess: boolean = false;
  constructor(
    public formBuilder: FormBuilder,
    private http:HttpClient,
  ) {}

  // Password match validator
  passwordMatchValidator: ValidatorFn = (control: AbstractControl): null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }

    return null;
  }

  // Form group definition
  form = this.formBuilder.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required], 
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/)
      ]
    ],
    confirmPassword: ['']
  }, { validators: this.passwordMatchValidator });

  // Submit handler
  onSubmit() {
    this.isSubmitted = true;
    this.errorMessage = null;

    if (this.form.valid) {
      console.log(this.form.value)
      this.http.post(this.baseURL+'/signup',this.form.value)
        .subscribe({
          next: (res: any) => {
            if (res.succeeded) {
              this.form.reset();
              this.isSubmitted = false;
              this.errorMessage = 'New user created successfully!';
              this.isSuccess = true;
            }
          },
          error: err => {
            if (err.error.errors) {
              err.error.errors.forEach((x: any) => {
                switch (x.code) {
                  case 'DuplicateUserName':
                    this.errorMessage = 'Username is already taken.';
                    break;
                  case 'DuplicateEmail':
                    this.errorMessage = 'Email is already taken.';
                    break;
                  default:
                    this.errorMessage = 'An unexpected error occurred. Please try again.';
                    console.error(x);
                    break;
                }
              });
            } else {
              console.error('Error:', err);
              this.errorMessage = 'An error occurred while processing your request.';
            }
          }
        });
    }
  }

  // Display error message for specific form control
  hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control?.invalid && (this.isSubmitted || control?.touched || control?.dirty);
  }
}

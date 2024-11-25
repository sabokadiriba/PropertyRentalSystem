// angular import
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FirstKeyPipe } from 'src/app/shared/pipes/first-key.pipe';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule, RouterLink, FirstKeyPipe, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  constructor(
    public formBuilder: FormBuilder,
    private http:HttpClient,
    private router: Router) { }
  isSubmitted: boolean = false;
  baseURL = 'http://localhost:5202/api';
  errorMessage: string | null = null;

  form = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  })

  hasDisplayableError(controlName: string): Boolean {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) &&
      (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty))
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.http.post(this.baseURL+'/signin',this.form.value).subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.token);
          this.router.navigateByUrl('/home');
        },
        error: err => {
          if (err.status == 400)
            this.errorMessage = 'Incorrect email or password.', 'Login failed';
            
          else
            console.log('error during login:\n', err);

        }
      })
    }
  }
}

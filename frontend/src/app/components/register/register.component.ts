import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { User } from '../../interfaces/user';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    return(password && confirmPassword && password.value !== confirmPassword.value ? {confirmPassword: true}: null)
  };

  LOGIN_URL: string = "https://localhost:7184/api/User/register";
  invalidLogin: boolean = false;
  credentials: User = {email:'', password:'', username: '', role: ''};
  
  registerForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    role: new FormControl('Customer')
  }, {validators: this.confirmPasswordValidator, updateOn: 'submit'});

  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);
  constructor(){
    this.registerForm.markAsPristine();
  }
  

  register(){
    this.credentials.email = this.registerForm.value.email;
    this.credentials.password = this.registerForm.value.password;
    this.credentials.role = this.registerForm.value.role;

    if (this.registerForm.valid) {
      this.http.post(this.LOGIN_URL, this.credentials, {
        headers: new HttpHeaders({ "Content-Type": "application/json"})
      })
      .subscribe({
        next: (response) => {
          console.log("Response:" + response);
          this.router.navigate(["/"]);
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.registerForm.setErrors({serverError: err.error});
        }
      })
    }
  }
}

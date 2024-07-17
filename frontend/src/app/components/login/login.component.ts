import { Component, OnInit, inject} from '@angular/core';
import { User } from '../../interfaces/user';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, NgForm, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationResponse } from '../../interfaces/authentication-response';
import { CommonModule } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  LOGIN_URL: string = "https://localhost:7184/api/User/login"
  invalidLogin: boolean = false;
  credentials: User = {email:'', password:'', username: '', role: ''};
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);
  loginService: LoginService = inject(LoginService);
  helper = new JwtHelperService();

  ngOnInit(): void {
    
  }

  

  TestAuth(){
    this.http.get("https://localhost:7184/WeatherForecast").subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  login2(){
    this.loginService.login(this.loginForm);
  }

  login(){
    this.credentials.email = this.loginForm.value.email;
    this.credentials.password = this.loginForm.value.password;

    if (this.loginForm.valid) {
      this.http.post<AuthenticationResponse>(this.LOGIN_URL, this.credentials, {
        headers: new HttpHeaders({ "Content-Type": "application/json"})
      })
      .subscribe({
        next: (response: AuthenticationResponse) => {
          const token = response.token;
          localStorage.setItem("jwt", token); 
          this.invalidLogin = false; 
          //console.log("Response:" + response);
          const tokenInfo = this.helper.decodeToken(token);
          console.log(tokenInfo);
          this.router.navigate(["/"]);
        },
        error: (err: HttpErrorResponse) => {
          this.invalidLogin = true
          console.log(err);
          this.loginForm.setErrors({invalidLogin: "Invalid username/password"});
        }
      })
    }
  }
}

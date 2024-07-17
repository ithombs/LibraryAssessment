import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationResponse } from '../interfaces/authentication-response';
import { User } from '../interfaces/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  LOGIN_URL: string = "https://localhost:7184/api/User/login";

  http: HttpClient = inject(HttpClient);
  credentials: User = {email:'', password:'', username: '', role: ''};
  invalidLogin: boolean = false;
  router: Router = inject(Router);
  helper = new JwtHelperService();

  constructor() { }

  isUserAuthenticated(){
    const token = localStorage.getItem("jwt");
    if (token && !this.helper.isTokenExpired(token)){
      return true;
    }else{
      return false;
    }
  }

  isUserLibrarian(){
    const token = localStorage.getItem("jwt");
    if(token != null && !this.helper.isTokenExpired(token)){
      if(this.helper.decodeToken(token).role == "Librarian"){
        return true;
      }
    }

    return false;
  }

  getUsername(){
    if(this.isUserAuthenticated()){
      const token = localStorage.getItem("jwt");
      if(token != null){
        return this.helper.decodeToken(token).unique_name;
      }
    }
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

  login(loginForm : FormGroup){
    this.credentials.email = loginForm.value.email;
    this.credentials.password = loginForm.value.password;

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
        loginForm.setErrors({invalidLogin: "Invalid username/password"});
      }
    })
    
  }
}

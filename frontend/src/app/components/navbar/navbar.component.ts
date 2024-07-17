import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  loginService : LoginService = inject(LoginService);
  helper = new JwtHelperService();
  username!: string;

  logOut(){
    localStorage.removeItem("jwt");
  }

  getUsername(){
    if(this.isUserAuthenticated()){
      const token = localStorage.getItem("jwt");
      if(token != null){
        return this.helper.decodeToken(token).unique_name;
      }
    }
  }

  isUserAuthenticated(){
    const token = localStorage.getItem("jwt");
    if (token && !this.helper.isTokenExpired(token)){
      return true;
    }else{
      return false;
    }
  }
}

import { CanActivateFn, Router } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LoginService } from './services/login.service';
import { inject } from '@angular/core';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const loginService : LoginService = inject(LoginService);
  const router : Router = inject(Router);
  
  if(loginService.isUserLibrarian()){
    return true;
  }else{
    router.navigate(['/']);
    return false;
  }
};

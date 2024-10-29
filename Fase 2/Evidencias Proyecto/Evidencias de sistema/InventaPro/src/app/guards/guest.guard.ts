import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const guestGuard: CanActivateFn = async (route, state) => {

  const authService = inject(AuthService); 
  const router = inject(Router);

  if(await authService.isLoggedIn()){
    router.navigate([''],{replaceUrl: true});
    return false;
  }
  else {
    return true;
  }

};

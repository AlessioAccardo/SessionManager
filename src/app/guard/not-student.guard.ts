import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const notStudentGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  const isBrowser = isPlatformBrowser(platformId);
  if (!isBrowser) {
    return false;
  }

  const isLoggedIn = !!localStorage.getItem('token');
  const jsonUser = localStorage.getItem('currentUser')
  const userLoggedIn = !!jsonUser

  if (userLoggedIn && isLoggedIn) {
    const user = JSON.parse(jsonUser);
    if (user.role !== 'studente') {
      return true;
    } else {
      router.navigateByUrl('not-found');
      return false;
    }
  } else {
    router.navigateByUrl('not-found');
    return false;
  }

};

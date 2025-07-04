import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  const isBrowser = isPlatformBrowser(platformId);
  if (!isBrowser) {
    return false;
  }

  const isLoggedIn = !!localStorage.getItem('token');
  const userLoggedIn = !!localStorage.getItem('currentUser');

  if (isLoggedIn && userLoggedIn) {
    return true;
  } else {
    router.navigateByUrl('no-role');
    return false;
  }
};

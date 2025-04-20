import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import {AuthenticationGuardService} from "./authentication-guard.service";
export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) =>
{
    const router: Router = inject(Router);
    //const authenticationGuardService: AuthenticationGuardService = inject(AuthenticationGuardService);

    if (localStorage.getItem('accessToken')) {
        return true;
    } else {
        router.navigate(['/sign-in']);

        return false;
    }
};

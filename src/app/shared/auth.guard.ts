import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { authService } from './auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
    providedIn : 'root'
})
export class AuthGuard implements CanActivate{
    constructor(private auth : authService, private router : Router){}
    canActivate(route : ActivatedRouteSnapshot , router : RouterStateSnapshot) : boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
        return this.auth.user.pipe(
            take(1),
            map(
            (user)=>{
                const isAuthenticated = !!user;
                if(isAuthenticated){
                    return true;
                }
                else {
                    return this.router.createUrlTree(['/auth']);
                }
                }
        )
        )
    }

}
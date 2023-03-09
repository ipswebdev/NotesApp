import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpParams } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { authService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor (private auth: authService){}
    intercept(req: HttpRequest<any>, next: HttpHandler){
        return this.auth.user.pipe(
            take(1),
            exhaustMap(
                user => {
                    if(!user){
                        return next.handle(req);
                    }
                    const modifedRequest = req.clone({params : new HttpParams().set( 'auth' , user.token)})
                    return next.handle(req);
                }))
        
    }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponse {
  idToken : string;
  email: string;
  refreshToken : string;
  expiresIn : string;
  localId : string;
  registered ?: boolean; 
}

@Injectable(
  {
      providedIn : 'root'
  }
)



export class authService{
    constructor(private httpClient : HttpClient, private router : Router){}
    user = new BehaviorSubject<User>(null);
    signUp(data){
      return  this.httpClient
      .post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDCWIwF-NJWve6WWlb6hl_ThzHmjXctASg',data)
      .pipe(
        catchError(this.errorHandler),
        tap(
          (resData) => {
            this.authenticationHandler(
              resData.email,
              resData.localId,
              resData.idToken,
              +resData.expiresIn
            )         
          }
        )
      );
    }
    login(data){
      return this.httpClient
      .post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDCWIwF-NJWve6WWlb6hl_ThzHmjXctASg',data)
      .pipe(
        catchError(this.errorHandler),
        tap(
          (resData) => {
            this.authenticationHandler(
              resData.email,
              resData.localId,
              resData.idToken,
              +resData.expiresIn
            )         
          }
        )
      );
      
    }
    logout(){
      this.user.next(null);
      this.router.navigate(['/auth']);
    }
    private errorHandler(errorResponse : HttpErrorResponse){
      let errorMessage = 'Some Unknown Error occured!';
            if(!errorResponse.error || !errorResponse.error.error){
              return throwError(errorMessage);
            }
            switch (errorResponse.error.error.message) {
              case 'EMAIL_EXISTS':
              errorMessage = errorResponse.error.error.message;   
              break;
              case 'INVALID_PASSWORD':
              errorMessage = 'Wrong Email/Password';
              break;
              case 'EMAIL_NOT_FOUND':
              errorMessage = 'No Account Exists for this Email ID'; 
              break;
              case 'USER_DISABLED':
              errorMessage = 'Account is temporarily DISABLED.. Try again later...'; 
              break;
            }
            return throwError(errorMessage);
    }
    private authenticationHandler(email : string, id: string, token: string, expiresIn:number){
      const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000)
      const user = new User(email,id,token,expirationDate);
      this.user.next(user);
    }
}
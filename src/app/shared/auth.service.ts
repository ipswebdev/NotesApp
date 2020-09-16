import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

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
    constructor(private httpClient : HttpClient){}
    signUp(data){
      return  this.httpClient
      .post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDCWIwF-NJWve6WWlb6hl_ThzHmjXctASg',data)
      .pipe(
        catchError(this.errorHandler)
      );
    }
    login(data){
      return this.httpClient
      .post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDCWIwF-NJWve6WWlb6hl_ThzHmjXctASg',data)
      .pipe(
        catchError(this.errorHandler)
      );
      
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
}
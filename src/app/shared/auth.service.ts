import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface AuthResponse {
  idToken : string;
  email: string;
  refreshToken : string;
  expiresIn : string;
  localId : string;
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
        catchError(
          (errorResponse) => {
            let errorMessage = 'Some Unknown Error occured!';
            if(!errorResponse.error || !errorResponse.error.error){
              return throwError(errorMessage);
            }
            switch (errorResponse.error.error.message) {
              case 'EMAIL_EXISTS':
                errorMessage = errorResponse.error.error.message;   
            }
            return throwError(errorMessage);
          }
        )
      );
    }
    login(data){
      
    }
}
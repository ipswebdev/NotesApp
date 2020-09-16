import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { authService,AuthResponse } from 'src/app/shared/auth.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  loginMode :boolean = false; 
  isLoading :boolean = false; 
  error :string = null;
  @ViewChild('authForm', {static: false}) authenticator : NgForm;
  constructor(private authService : authService) { }

  ngOnInit(): void {
  }
  onSubmit(authForm : NgForm){
    this.isLoading = true;
    let AuthObservable :Observable <AuthResponse>;
    if(!authForm.valid){
      console.log('invalid')
    }
    if(!this.loginMode){
      const email = authForm.value.email;
      const password = authForm.value.password;
    
    const token = {
      email : email,
      password : password,
      returnSecureToken : true
    };
    AuthObservable = this.authService.signUp(token);
    }
    if(this.loginMode){
      console.log('YOU TRIED TO LOGIN!');
      const email = authForm.value.email;
      const password = authForm.value.password;
    const token = {
      email : email,
      password : password,
      returnSecureToken : true
    };
    AuthObservable = this.authService.login(token);
    }
    AuthObservable.subscribe(
      (data) => {
        console.log('SUCCESS');
        console.log(data);
        this.isLoading = false;
      },
      (errorMessage) => {
        console.log('ERROR');
        this.error = errorMessage;
        this.isLoading = false;
      }
    );
    this.authenticator.reset();
  }
  switchMode(){
    this.loginMode = !this.loginMode;
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { authService } from 'src/app/shared/auth.service';


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
    this.authService.signUp(token).subscribe(
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
    }
    if(this.loginMode){
      console.log('YOU TRIED TO LOGIN!');
    }
    this.authenticator.reset();
  }
  switchMode(){
    this.loginMode = !this.loginMode;
  }

}

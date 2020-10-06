import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { authService,AuthResponse } from 'src/app/shared/auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponentComponent } from 'src/app/alert-component/alert-component.component';
import { PlaceholderDirective } from 'src/app/shared/placeholder.directive';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit,OnDestroy {
  loginMode :boolean = false; 
  isLoading :boolean = false; 
  error :string = null;
  @ViewChild('authForm', {static: false}) authenticator : NgForm;
  @ViewChild(PlaceholderDirective,{static : false}) errorAlert : PlaceholderDirective ;

  private errorSub : Subscription;

  constructor(private authService : authService, private router : Router, private componentFactoryResolver : ComponentFactoryResolver) { }

  ngOnInit(): void {
  }
  ngOnDestroy(){
    if(this.errorSub){
      this.errorSub.unsubscribe();
    }  
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
        console.log(data);
        this.isLoading = false;
        this.router.navigate(['/notes'])
      },
      (errorMessage) => {
        console.log('ERROR');
        this.error = errorMessage;
        this.showErrorAlert(errorMessage);
        this.isLoading = false;
      }
    );
    this.authenticator.reset();
  }
  switchMode(){
    this.loginMode = !this.loginMode;
  }
  handleError(){
    this.error=null;
  }
  private showErrorAlert(message : string){
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponentComponent);
    const hostViewContainerRef = this.errorAlert.viewContainerRef;
    hostViewContainerRef.clear();
    const componentReference =  hostViewContainerRef.createComponent(componentFactory);
    componentReference.instance.message = message;
    this.errorSub = componentReference.instance.close.subscribe(()=>{
      this.errorSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
}

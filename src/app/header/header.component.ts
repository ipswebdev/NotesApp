import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotesService } from '../shared/notes.service';
import { Notes } from '../shared/note.model';
import { Router } from '@angular/router';
import { AuthComponent } from '../auth/auth/auth.component';
import { Subscription } from 'rxjs';
import { authService } from '../shared/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  note : Notes;
  private userSub : Subscription;
  isAuthenticated = false;
  
  constructor(private notesService : NotesService, private router : Router, private authService : authService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(
      (user)=>{
        this.isAuthenticated = !user ? false : true ;
      }
    )
  }
  logout(){
    this.authService.logout();
  }
  createNewNote(){
    this.router.navigate(['notes-detail',-1,'create']);
  }
  ngOnDestroy(){
this.userSub.unsubscribe();
  }
}

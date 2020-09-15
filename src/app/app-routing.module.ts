import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotesComponent } from './notes/notes.component';
import { NotesDetailComponent } from './notes-detail/notes-detail.component';
import { PathNotFoundComponent } from './path-not-found/path-not-found.component';
import { NotesResolver } from './shared/noteResolver.service';
import { AuthComponent } from './auth/auth/auth.component';

export const routes: Routes = [
  {
    path : '',
    component : NotesComponent 
  },
  {
    path : 'notes',
    component : NotesComponent
  },
  {
    path : 'notes-detail/:id/:mode',
    component : NotesDetailComponent,
    resolve : { NotesEdit : NotesResolver}
  },
  {
    path : 'auth',
    component : AuthComponent,
  },
  { 
    path: '404', 
    component: PathNotFoundComponent 
  },
  {
    path:'**',
    redirectTo : '404'
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

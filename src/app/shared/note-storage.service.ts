import { Injectable } from '@angular/core';
import { Notes } from './note.model';
import { Subject } from 'rxjs';
import { NotesService } from './notes.service';

import { HttpClient, HttpParams } from '@angular/common/http';
import { authService } from './auth.service';
import { exhaustMap, take } from 'rxjs/operators';
import { User } from './user.model';

@Injectable(
    {
        providedIn : 'root'
    }
)

export class NoteStorage{
    notes : Notes[] = [];
    userId : string = '';
    constructor(private http : HttpClient, private auth:authService){}
    fetchUserId(){
        this.auth.user.pipe(
            take(1)
        )
        .subscribe(
            (data:User)=>{
                this.userId = data.id;
                // console.log('user id is :',this.userId);
        })            
    }
    fetchNotes(){
        this.fetchUserId();
        const url = 'https://omdb-project-11edb.firebaseio.com/notes/'+this.userId+'.json';
        // console.log('user id is inside fetchNotes',this.userId);
        return this.http.get<Notes[]>(url);
    }
    update(note){
        // this.fetchUserId();
        // const url = 'https://omdb-project-11edb.firebaseio.com/notes/'+note.id+'/.json';
        this.fetchUserId();
        const url = 'https://omdb-project-11edb.firebaseio.com/notes/'+this.userId+'/'+note.id+'.json';
        console.log('this the url used',url);
        console.log('this the note sent',note);
        return this.http.patch<Notes>(url,note);
        
    }
    addNote(note : Notes){
        this.fetchUserId();
        const url = 'https://omdb-project-11edb.firebaseio.com/notes/'+this.userId+'.json';
        return this.http.post(url,note);
    }
    deleteNote(noteId:string){
        this.fetchUserId();
        console.log('note id is',noteId);
        const url = 'https://omdb-project-11edb.firebaseio.com/notes/'+this.userId+'/'+noteId+'.json';
        return this.http.delete(url);
    }
}
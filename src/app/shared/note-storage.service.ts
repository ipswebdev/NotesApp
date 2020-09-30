import { Injectable } from '@angular/core';
import { Notes } from './note.model';
import { Subject } from 'rxjs';
import { NotesService } from './notes.service';

import { HttpClient, HttpParams } from '@angular/common/http';
import { authService } from './auth.service';
import { exhaustMap, take } from 'rxjs/operators';

@Injectable(
    {
        providedIn : 'root'
    }
)

export class NoteStorage{
    notes : Notes[] = [];
    constructor(private http : HttpClient, private auth:authService){}
    fetchNotes(){
        return this.auth.user.pipe(
            take(1),
            exhaustMap(
                user => {
                    return this.http.get<Notes[]>('https://omdb-project-11edb.firebaseio.com/notes.json',{
                        params : new HttpParams().set('auth',user.token)
                    })
                }
            ))
        
    }
    update(note){
        const url = 'https://omdb-project-11edb.firebaseio.com/notes/'+note.id+'/.json';
        console.log('this the url used',url);
        console.log('this the note sent',note);
        return this.http.patch<Notes>(url,note);
        
    }
    addNote(note : Notes){
        return this.http.post('https://omdb-project-11edb.firebaseio.com/notes.json',note);
    }
}
import { Injectable } from '@angular/core';
import { Notes } from './note.model';
import { Subject } from 'rxjs';
import { NotesService } from './notes.service';

import { HttpClient } from '@angular/common/http';

@Injectable(
    {
        providedIn : 'root'
    }
)

export class NoteStorage{
    notes : Notes[] = [];
    constructor(private http : HttpClient){}
    fetchNotes(){
        return this.http.get<Notes[]>('https://omdb-project-11edb.firebaseio.com/notes.json');
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
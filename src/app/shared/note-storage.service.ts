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
    baseUrl = 'http://localhost:3000/api/';
    constructor(private http : HttpClient, private auth:authService){}
    // fetchUserId(){
    //     this.auth.user.pipe(
    //         take(1)
    //     )
    //     .subscribe(
    //         (data:User)=>{
    //             this.userId = data.id;
    //     })            
    // }
    // fetchNotes(){
    //     //this.fetchUserId();
    //     const url = 'https://omdb-project-11edb.firebaseio.com/notes/'+this.userId+'.json';
    //     return this.http.get<Notes[]>(url);
    // }
    fetchNotes(){
    // //this.fetchUserId();
        const url = `${this.baseUrl}notes`;
        console.log('fetch notes',url)
        return this.http.get<{notes:any[],message:string}>(url);
    }
    
    fetchNote(id:string){
        // //this.fetchUserId();
            const url = `${this.baseUrl}notes/${id}`;
            console.log('fetch notes',url)
            return this.http.get<{note:any,message:string}>(url);
    }

    update(note){
        // //this.fetchUserId();
        const url = `${this.baseUrl}notes/${note.id}`;
        console.log('update',note);
        return this.http.put<Notes>(url,note);
        
    }
    addNote(note : Notes){
        //this.fetchUserId();
        const url = `${this.baseUrl}notes`;
        return this.http.post(url,note);
    }
    deleteNote(noteId:string){
        //this.fetchUserId();
        console.log('note id is',noteId);
        const url = `${this.baseUrl}notes/${noteId}`;
        return this.http.delete(url);
    }
}
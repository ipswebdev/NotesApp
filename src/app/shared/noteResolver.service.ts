import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Notes } from './note.model';
import { NotesService } from './notes.service';
import { NoteStorage } from './note-storage.service';

@Injectable(
    {
        providedIn : 'root'
    }
)
export class NotesResolver implements Resolve<Notes>{
    constructor(private notesService : NotesService){}
    resolve(route: ActivatedRouteSnapshot,state : RouterStateSnapshot): Observable<Notes> | Promise<Notes> | Notes {
        this.notesService.notes.length = 0;
        this.notesService.fetchAllNotes();
        console.log('checking nots from resolver service',this.notesService.notes);
        console.log('resolve function ran getting the id as',route.params['id']);
        console.log('resolve function ran giving individual note  as',this.notesService.notes);
        // return this.notesService.getNote(+route.params['id']);
        return {title : 'this sis title', description : 'this is description'};
    }
}
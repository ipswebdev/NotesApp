import { Injectable } from '@angular/core';
import { Notes } from './note.model';
import { Subject, pipe } from 'rxjs';
import { NoteStorage } from './note-storage.service';
import { map } from 'rxjs/operators';



@Injectable(
    {
        providedIn : 'root'
    }
)

export class NotesService{
    constructor(private notesStorage : NoteStorage){}
    notes : Notes[]=[
        // new Notes('1','Test Note','test Desc.',true),
        // new Notes('1','Test Note 2','test Desc.2',false),
        // new Notes('1','Test Note 3','test Desc.3',true),
    ];
    // note : Notes;
    notesFetched = new Subject<number>();
    noteChanged = new Subject<any>(); 

    fetchAllNotes(){
        this.notesStorage.fetchNotes()
        .pipe(map(
            (response) => {
                let allNotes = [];
                const arrOfNotes =  Object.keys(response);
                    for (let i=0;i<arrOfNotes.length;i++) {
                         allNotes.push(
                             {
                             id : arrOfNotes[i],
                             ...response[arrOfNotes[i]]
                            }
                         );
                    }
                return allNotes;
            }
        ))
        .subscribe(
            (response) => {
                this.notes = response;
                this.notesFetched.next(1);
            },
            (err) => {
                this.notesFetched.next(0);
            }
        );
    }
    getNotes(){
        return this.notes;
    }
    getSingleNote(index): Notes{
        return this.notes[index];
    }
    addNewNote(noteReceived : Notes){
        this.notesStorage.addNote(noteReceived)
        .pipe(map(
            (response) => {
                for (const key in response) {
                    if (response.hasOwnProperty(key)) {
                        return response[key];
                    }
                }
            }
        ))
        .subscribe((response)=>{
            this.notes.push({
                id : response,
                title : noteReceived.title,
                description : noteReceived.description,
                isImportant : noteReceived.isImportant
            })
        });
        
    }

    onUpdateNote(id:number,note){
        this.notes[id]=note;
        this.noteChanged.next(true);
        this.notesStorage.update(note).subscribe(
            (response) =>{
                console.log('respponse of patch',response);
            }
        );
    }
}
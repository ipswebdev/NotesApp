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
    public notes : Notes[]=[
        // new Notes('Test Note','test Desc.',true),
        // new Notes('Test Note 2','test Desc.2',false),
        // new Notes('Test Note 3','test Desc.3',true),
    ];
    // note : Notes;
    notesSetter = new Subject<Notes[]>();
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
                for (let i=0;i<response.length;i++) {
                    this.notes.push(response[i]);
                }
            console.log('notes are',this.notes);
            }
        );
    }
    getNotes(){
        console.log('get nootes function value',this.notes);
        return this.notes;
    }
    getSingleNote(index): Notes{
        index =3;
        console.log('getSingleNote ran for index',index);
        console.log('getSingleNote O/P',this.notes[index]);
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
            //console.log('respons we get is',response);
            this.notes.push({
                id : response,
                title : noteReceived.title,
                description : noteReceived.description,
                isImportant : noteReceived.isImportant
            })
        });
        
    }

    onUpdateNote(id:number,note){
        //console.log('ran update fn');
        this.notes[id]=note;
        //console.log('array is',this.notes.slice());
        //console.log('------');
        this.noteChanged.next(true);
        this.notesStorage.update(note).subscribe(
            (response) =>{
                //console.log('respponse of patch',response);
            }
        );
    }
}
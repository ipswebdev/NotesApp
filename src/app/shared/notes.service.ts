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
        .pipe(map(res=>{
            return {notes:res.notes.map(note =>{
                return {
                    id:note._id,
                    title:note.title,
                    description:note.description
                }
            }),
            message: res.message
            }
        }))
        .subscribe(
            (response:any) => {
                if(response){
                    this.notes = response.notes;
                    console.log(response)
                    this.notesFetched.next(1);
                }
                if(response === null){
                    this.notes = [];
                    this.notesFetched.next(0);
                }
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
        // .pipe(map(
        //     (response) => {
        //         for (const key in response) {
        //             if (response.hasOwnProperty(key)) {
        //                 return response[key];
        //             }
        //         }
        //     }
        // ))
        .subscribe((response)=>{
            console.log(response,'all notes',this.notes)
            // this.notes.push({
            //     id : response,
            //     title : noteReceived.title,
            //     description : noteReceived.description,
            //     // isImportant : noteReceived.isImportant
            // })
        });
        
    }

    onUpdateNote(id:string,note){
        console.log('patch',id,note);
        this.notesStorage.update(note).subscribe(
            (response) =>{
                console.log('respponse of patch',response);
                this.noteChanged.next(true);
            }
        );
    }

    deleteNote(id:string){
        console.log('note to be deleted is',this.notes[id]);
        this.notesStorage.deleteNote(id).subscribe(
            (response)=>{
                console.log('response is',response);
            }
        )
    }
}
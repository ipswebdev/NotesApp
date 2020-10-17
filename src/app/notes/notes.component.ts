import { Component, OnInit, OnDestroy } from '@angular/core';
import { Notes } from '../shared/note.model';
import { NotesService } from '../shared/notes.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NoteStorage } from '../shared/note-storage.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit, OnDestroy {
  notesArr : Notes[] = [];
  notesFetched : boolean = false;
  newNote : Notes ={
    title:'',
    description:'',
    isImportant:false
  }; 
  isNoteEdited :boolean;
  constructor(private notesService : NotesService,private router : Router,private http : NoteStorage ) { }

  ngOnInit(){
    this.notesService.notes.length = 0;
    this.notesService.fetchAllNotes();
    this.isNoteEdited = false;
    this.notesService.notesFetched.subscribe(
      (response)=>{
        if(response === 1){
          this.notesFetched = true;
          this.notesArr = this.notesService.getNotes();
        }
      },
      (response) => {
        if(response === 0){
          this.notesFetched = false;
        }
      }
    );
   
  }

 /*  getNote(){
    console.log(this.notesService.getSingleNote(1));

  }
 
  setterSubscription : Subscription;

  addNote(note : Notes){
    this.newNote = note; 
    console.log('new Note : ',note);
    console.log('new Note : ',this.newNote);
  } */
  toEdit(index){
    this.router.navigate(['notes-detail',index,'edit']);
  }
  ngOnDestroy(){}
}

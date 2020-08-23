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
    this.notesArr = this.notesService.getNotes();
    console.log('notesArr value',this.notesArr);
    console.log('notes value in service',this.notesService.notes);
    let notesCollection = this.notesService.getNotes();
    console.log('notesXollectn',notesCollection);
  }
 
  setterSubscription : Subscription;

  addNote(note : Notes){
    this.newNote = note; 
    console.log('new Note : ',note);
    console.log('new Note : ',this.newNote);
    this.notesService.addNewNote(this.newNote);
  }
  toEdit(index){
    this.router.navigate(['notes-detail',index,'edit']);
    console.log('navigate fn');
  }
  ngOnDestroy(){}
}

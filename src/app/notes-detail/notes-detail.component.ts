
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Route, Router, Params, Data } from '@angular/router';
import { Notes } from '../shared/note.model';
import { NotesService } from '../shared/notes.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotesResolver } from '../shared/noteResolver.service';

@Component({
  selector: 'app-notes-detail',
  templateUrl: './notes-detail.component.html',
  styleUrls: ['./notes-detail.component.scss']
})
export class NotesDetailComponent implements OnInit {
  note : Notes ;
  notesArr;
  id : number;
  isImp =false;
  noteForm : FormGroup;
  noteMode : string;
  successMessage : string;

  constructor(private route : ActivatedRoute, private notesService : NotesService,private resolver : NotesResolver) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      (data : Data)=>{
        this.notesArr=data.NotesEdit;
      });
      this.notesService.notesFetched.subscribe(
        (response)=>{
          if(response === 1){
            this.fetchParams();        
          }
        }
      );
  }
  fetchParams(){
    this.route.params.subscribe(
      (params : Params) => {
        this.id = +params['id'];
        this.noteMode = params['mode'];
      }
    );
    this.onformInit();
  }
  onformInit(){
    console.log('OnFormInit called');
    console.log('id is',this.id);
    console.log('mode is',this.noteMode);
    if(this.noteMode === 'edit'){
      console.log('notemode :',this.noteMode);
      console.log('id via route :',this.id);
      this.updateNote();
    }
    if(this.noteMode === 'create'){
      console.log('notemode :',this.noteMode);
      this.setNewNote();
    }
  }
  setNewNote(){
    this.noteForm  = new FormGroup({
      'title' : new FormControl('',Validators.required),
      'description' : new FormControl('',Validators.required),
      'isImportant' : new FormControl(false,Validators.required)
    });
  }
  updateNote(){
    this.note = this.notesService.notes[this.id];
    console.log('note to be updated is ',this.note);
    this.noteForm  = new FormGroup({
      'title' : new FormControl(this.note.title,Validators.required),
      'description' : new FormControl(this.note.description,Validators.required),
      'isImportant' : new FormControl(this.note.isImportant,Validators.required)
    });
  }
  onSubmit(){
    console.log('submitted');
    console.log('is note important value',this.isImp);
  
    if(this.noteMode === 'edit'){
      
      console.log(this.note);
      
      console.log('edited note is ', this.note);
      this.note.title = this.noteForm.value.title; 
      this.note.description = this.noteForm.value.description;
      this.note.isImportant = this.noteForm.value.isImp;
      this.notesService.onUpdateNote(this.id,this.note); 
      this.successMessage = 'you have successfully edited the current note';
    }
    if(this.noteMode === 'create'){
      this.note.title = this.noteForm.value.title; 
      this.note.description = this.noteForm.value.description;
      this.note.isImportant = this.noteForm.value.isImportant;
      console.log(this.note);
      this.notesService.addNewNote(this.note);
      this.successMessage = 'you have successfully created an new note';
    }
    this.noteForm.reset();
  }
}

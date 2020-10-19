
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
  successNotification : boolean;

  constructor(private route : ActivatedRoute, private notesService : NotesService,private resolver : NotesResolver) { }

  ngOnInit(): void {
    this.successNotification = false;
    console.log('oninit started');
    this.route.data.subscribe(
      (data : Data)=>{
        this.notesArr=data.NotesEdit;
      });
      this.notesService.notesFetched.subscribe(
        (response)=>{
          // if(response === 1){
            this.fetchParams();       
          // }
          // if(response === 0){
            // this.fetchParams();
          // }
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
    this.formInit(); 
  }

  formInit(){
    if(this.noteMode === 'edit' && this.id !== -1){
      this.updateNote();
    }
    if(this.noteMode === 'create' && this.id === -1){
      this.note = {
        title : '',
        description : '',
        isImportant : false,
      }
      this.setNewNote(this.note);
    }
   
  }

  setNewNote(note){
    
    this.noteForm  = new FormGroup({
      'title' : new FormControl(note.title,Validators.required),
      'description' : new FormControl(note.description,Validators.required),
      'isImportant' : new FormControl(note.isImportant)
    });    
    this.successNotification = false;
  }

  updateNote(){
    
    this.note = this.notesService.notes[this.id];
    this.noteForm  = new FormGroup({
      'title' : new FormControl(this.note.title,Validators.required),
      'description' : new FormControl(this.note.description,Validators.required),
      'isImportant' : new FormControl(this.note.isImportant)
    });
    this.successNotification = false;
  }

  onSubmit(){
  
    if(this.noteMode === 'edit'){
      this.note.title = this.noteForm.value.title; 
      this.note.description = this.noteForm.value.description;
      this.note.isImportant = this.noteForm.value.isImportant;
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
    // this.noteForm.reset();
    this.successNotification = true;
  }

  deleteNote(){
    this.notesService.deleteNote(this.id);
  }
}

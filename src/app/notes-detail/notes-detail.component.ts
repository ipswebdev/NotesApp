
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Route, Router, Params, Data } from '@angular/router';
import { Notes } from '../shared/note.model';
import { NotesService } from '../shared/notes.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-notes-detail',
  templateUrl: './notes-detail.component.html',
  styleUrls: ['./notes-detail.component.scss']
})
export class NotesDetailComponent implements OnInit {
  note : Notes ;
  notesArr : Notes[]=[];
  id : number;
  isImp =false;
  form : FormGroup;
  noteMode : string;
  successMessage : string;

  constructor(private route : ActivatedRoute, private notesService : NotesService) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params : Params) => {
        console.log('params fetched');
        this.id = +params['id'];
        this.noteMode = params['mode'];
          console.log('note corresponding to id is',this.id)

          if(this.noteMode === 'edit'){
            this.note=this.notesArr[this.id];
            this.form  = new FormGroup({
              'title' : new FormControl(this.note.title,Validators.required),
              'description' : new FormControl(this.note.description,Validators.required)
            });
          }

          if(this.noteMode === 'create'){
            // this.note = {
            //   title : '',
            //   description : '',
            //   isImportant : false
            // }
            this.form  = new FormGroup({
              'title' : new FormControl(null,Validators.required),
              'description' : new FormControl(null,Validators.required)
            });
          }

      }
    );

    // this.onformInit();
  }
  onformInit(){
    
   
  }

  onSubmit(){
    console.log('submitted');
    console.log('is note important value',this.isImp);
  
    if(this.noteMode === 'edit'){
      
      console.log(this.note);
      
      console.log('edited note is ', this.note);
      this.note.title = this.form.value.title; 
      this.note.description = this.form.value.description;
      this.note.isImportant = this.isImp;
      this.notesService.onUpdateNote(this.id,this.note); 
      this.successMessage = 'you have successfully edited the current note';
    }
    if(this.noteMode === 'create'){
      this.note.title = this.form.value.title; 
      this.note.description = this.form.value.description;
      this.note.isImportant = this.isImp;
      console.log(this.note);
      this.notesService.addNewNote(this.note);
      this.successMessage = 'you have successfully created an new note';
    }
    this.form.reset();
  }
}

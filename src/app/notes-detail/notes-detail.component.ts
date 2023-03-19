
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Route, Router, Params, Data } from '@angular/router';
import { Notes } from '../shared/note.model';
import { NotesService } from '../shared/notes.service';
import { FormGroup, FormControl, Validators, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { NotesResolver } from '../shared/noteResolver.service';
import { Subscription } from 'rxjs';
import { NoteStorage } from '../shared/note-storage.service';
import { map } from 'rxjs/operators';
import { imageValidator } from '../shared/image.validator';

@Component({
  selector: 'app-notes-detail',
  templateUrl: './notes-detail.component.html',
  styleUrls: ['./notes-detail.component.scss']
})
export class NotesDetailComponent implements OnInit,OnDestroy {
  note : Notes ;
  notesArr;
  id : any;
  isImp =false;
  imagePreview: string;
  noteForm : FormGroup;
  isLoading: boolean = false;
  noteMode : string;
  successMessage : string;
  successNotification : boolean;
  notesFetchSub : Subscription;

  constructor(private route : ActivatedRoute, private notesStorage : NoteStorage, private notesService : NotesService,private resolver : NotesResolver, private router : Router) { }

  ngOnInit(): void {
    this.successNotification = false;
    console.log('oninit started');
    //   this.notesFetchSub=this.notesService.notesFetched.subscribe(
    //     (response)=>{
    //       // if(response === 1){
            this.fetchParams();       
    //       // }
    //       // if(response === 0){
    //         // this.fetchParams();
    //       // }
    //     }
    //   );
    // this.notesStorage.  
  }

  fetchParams(){
    this.route.params.subscribe(
      (params : Params) => {
        this.id = params['id'];
        this.noteMode = params['mode'];
      }
    );
    this.formInit();
  }

  formInit(){
    if(this.noteMode === 'create' && this.id === '-1'){
      this.note = {
        title : '',
        description : '',
        isImportant : false,
        image: ''
      }
      this.setNewNote(this.note);
    }
    if(this.noteMode === 'edit' && this.id !== ''){
      this.getNote();
    }
  }

  newImgPicked(event:Event){

    let file = (event.target as HTMLInputElement).files[0];
    this.noteForm.patchValue({image:file})
    this.noteForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = ()=>{
      this.imagePreview = reader.result as string;
      console.log('picked  file',this.imagePreview,this.noteForm) 
    }
    reader.readAsDataURL(file)
    
  }

  setNewNote(note){
    this.noteForm  = new FormGroup({
      'title' : new FormControl(note.title,Validators.required),
      'description' : new FormControl(note.description,Validators.required),
      'image' : new FormControl(note.image,{asyncValidators:[imageValidator]}),
      'isImportant' : new FormControl(note.isImportant)
    });    
    this.successNotification = false;
  }

  getNote(){
    this.isLoading = true;
    this.notesStorage.fetchNote(this.id)
    .pipe(map(
      res => {
        return {
          message:res.message,
          note:{
            id:res.note._id,
            title:res.note.title,
            description:res.note.description,
            isImportant:res.note.isImportant
          }
        }
      }
    ))
    .subscribe(data=>{
      console.log('fetched individual note',data)
      this.note = {...data.note};
      this.isLoading = false;
      this.updateNote();
    },err=>{
      this.isLoading = false;
    })
  }

  updateNote(){
    
    // this.note = this.notesService.notes[this.id];
    this.noteForm  = new FormGroup({
      'title' : new FormControl(this.note.title,Validators.required),
      'description' : new FormControl(this.note.description,Validators.required),
      'image' : new FormControl(null),
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
      this.noteForm.reset();
      setTimeout(()=>{
        this.router.navigate(['/notes']);
      },2500)
    }
    // this.noteForm.reset();
    this.successNotification = true;
  }

  deleteNote(){
    this.notesService.deleteNote(this.note.id);
    this.noteForm.reset();
    this.successMessage = 'you have successfully deleted your note';
    this.successNotification = true;
    setTimeout(()=>{
      this.router.navigate(['/notes']);
    },2500)
  }

  ngOnDestroy(){
    // this.notesFetchSub.unsubscribe();
  }
}

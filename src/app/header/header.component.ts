import { Component, OnInit } from '@angular/core';
import { NotesService } from '../shared/notes.service';
import { Notes } from '../shared/note.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  note : Notes;
  constructor(private notesService : NotesService, private router : Router) { }

  ngOnInit(): void {

  }
  createNewNote(){
    this.router.navigate(['notes-detail','create']);
  }
  // getAllNotes(){
  //   this.notesService.fetchAllNotes();
  // }
}

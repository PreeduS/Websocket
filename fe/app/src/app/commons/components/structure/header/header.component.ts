import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() username;
  @Output() signOutChange = new EventEmitter()

  items = [{}]
  constructor() { }

  ngOnInit() {
  }
  signOut(){
    this.signOutChange.emit(true)
  }
}

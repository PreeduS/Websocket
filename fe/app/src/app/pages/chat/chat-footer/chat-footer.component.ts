import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'chat-footer',
  templateUrl: './chat-footer.component.html',
  styleUrls: ['./chat-footer.component.scss']
})
export class ChatFooterComponent implements OnInit {
  @Input() username: string;
  @Input() chatAuthenticated: boolean;
  @Output() commentChange = new EventEmitter();

  commentValue: string = '';
  
  constructor() {

  }

  ngOnInit() {

  }
  addComment(){
    this.commentChange.emit(this.commentValue)
    this.commentValue = ''
  }
}

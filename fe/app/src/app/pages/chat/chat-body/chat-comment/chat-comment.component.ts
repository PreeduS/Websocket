import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'chat-comment',
  templateUrl: './chat-comment.component.html',
  styleUrls: ['./chat-comment.component.scss']
})
export class ChatCommentComponent implements OnInit {
  @Input() comment
  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'chat-header',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.scss']
})
export class ChatHeaderComponent implements OnInit {
  @Input() username: string;
  @Input() chatAuthenticated: boolean;
  constructor(private router: Router) { }

  ngOnInit() {
  }
  signIn(){
    this.router.navigate(['/signin'])
  }
}

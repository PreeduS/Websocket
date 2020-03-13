import { Component, OnInit, Input, Renderer2, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'chat-comment',
  templateUrl: './chat-comment.component.html',
  styleUrls: ['./chat-comment.component.scss']
})
export class ChatCommentComponent implements OnInit {
  @Input() comment;

  @ViewChild('content', {static: false}) 
  private content: ElementRef;	
  
  // {{comment.content.comment}}
  constructor(private renderer: Renderer2) {}


  ngOnInit() {}
  ngAfterViewInit() {
      const comment = this.comment.content.comment;
      const commentList: string[] =  comment.split('\n')
      //const content = this.renderer.createElement('content'); 
      const content = this.renderer.createElement('div'); 

    
      //const a = this.renderer.createText('aThis is a button');

    for(let i = 0; i< commentList.length; i++){
        const comment = commentList[i];
        const hasNext = i < commentList.length;

        const a = this.renderer.createElement('span');
        this.renderer.appendChild(a, this.renderer.createText(comment));

        this.renderer.appendChild(content, a);
        if(hasNext){
            const br = this.renderer.createElement('br');
            this.renderer.appendChild(content, br);
        }

    }

      this.renderer.appendChild(this.content.nativeElement, content);
  }

}

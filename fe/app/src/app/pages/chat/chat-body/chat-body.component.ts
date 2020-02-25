import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'chat-body',
  templateUrl: './chat-body.component.html',
  styleUrls: ['./chat-body.component.scss']
})
export class ChatBodyComponent implements OnInit {
  @Input() comments;
  @Input() users;
  @ViewChild("commentsWrapper",{static: false}) commentsWrapper: ElementRef<any>;
  commentsLength = 0;
  constructor() { }

  ngOnInit() {
  }


    ngAfterViewChecked(){
    if(this.commentsLength !== this.comments.length){
      console.log('ngDoCheck trigger', this.commentsLength, this.comments.length)
      const commentsWrapperRef = this.commentsWrapper.nativeElement;
      commentsWrapperRef.scrollTop = commentsWrapperRef.scrollHeight
      this.commentsLength = this.comments.length;
    }
  }


    /*
 let elementRef = this.tpl.elementRef;
        // outputs `template bindings={}`
        console.log(elementRef.nativeElement.textContent);
    }
}
    */
  //}

}

import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'chat-body',
  templateUrl: './chat-body.component.html',
  styleUrls: ['./chat-body.component.scss']
})
export class ChatBodyComponent implements OnInit {
  @Input() comments;
  @Input() users;
  @Output() commentChange = new EventEmitter();
  @ViewChild("commentsWrapper",{static: false}) commentsWrapper: ElementRef<any>;
  commentsLength = 0;
  constructor() { }
  commentValue: string = '';

  setCommentValue(e){
      console.log('e.target.value',e.target.value)
      this.commentValue = e.target.value;
  }

  ngOnInit() {
  }

  addComment(){
    this.commentChange.emit(this.commentValue)
    this.commentValue = ''
  }
    ngAfterViewChecked(){
    if(this.commentsLength !== this.comments.length){
      //console.log('ngDoCheck trigger', this.commentsLength, this.comments.length)
      const commentsWrapperRef = this.commentsWrapper.nativeElement;

    //  console.log('commentsWrapperRef.scrollHeight', commentsWrapperRef.scrollHeight)
    //  console.log('commentsWrapperRef.scrollTop', commentsWrapperRef.scrollTop + commentsWrapperRef.clientHeight)
    //  console.log('commentsWrapperRef.dif', commentsWrapperRef.scrollHeight-(commentsWrapperRef.scrollTop + commentsWrapperRef.clientHeight),'\n\n')
    const scrollFromBottom = commentsWrapperRef.scrollHeight- (commentsWrapperRef.scrollTop + commentsWrapperRef.clientHeight);
    console.log('scrollFromBottom ',scrollFromBottom)
      if(scrollFromBottom <= 60){
 
        commentsWrapperRef.scrollTop = commentsWrapperRef.scrollHeight
      }
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

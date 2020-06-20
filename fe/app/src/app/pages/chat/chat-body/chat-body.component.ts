import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'chat-body',
  templateUrl: './chat-body.component.html',
  styleUrls: ['./chat-body.component.scss']
})
export class ChatBodyComponent implements OnInit {
  @Input() comments;
  @Input() users;
  @Input() chatAuthenticated: boolean;
  @Output() commentChange = new EventEmitter();
  @ViewChild("commentsWrapper",{static: false}) commentsWrapper: ElementRef<any>;
  commentsLength = 0;
  constructor(private userService: UserService) { }
  commentValue: string = '';
  username: string | null = null;
  snappedToBottom: boolean = null;

  setCommentValue(e){
      console.log('e.target.value',e.target.value)
      this.commentValue = e.target.value;
  }

  ngOnInit() {
    this.userService.getUser().subscribe(user => {
      this.username = user.username;
    })

  }
  ngAfterViewInit() {

    //const commentsWrapperRef = this.commentsWrapper.nativeElement;
    //console.log('commentsWrapperRef ',commentsWrapperRef,commentsWrapperRef.scrollHeight)
    //commentsWrapperRef.scrollTop = commentsWrapperRef.scrollHeight

  }

  addComment(){
    this.commentChange.emit(this.commentValue)
    this.commentValue = ''
  }


    ngAfterViewChecked(){
    if(this.commentsLength !== this.comments.length ){

      //console.log('ngDoCheck trigger', this.commentsLength, this.comments.length)
      const commentsWrapperRef = this.commentsWrapper.nativeElement;
      const lastComment = this.comments[this.comments.length -1]
      const lastCommentUsername = lastComment && lastComment.user.username;
      const selfComment = lastCommentUsername && this.username && lastCommentUsername === this.username;

    //  console.log('commentsWrapperRef.scrollHeight', commentsWrapperRef.scrollHeight)
    //  console.log('commentsWrapperRef.scrollTop', commentsWrapperRef.scrollTop + commentsWrapperRef.clientHeight)
    //  console.log('commentsWrapperRef.dif', commentsWrapperRef.scrollHeight-(commentsWrapperRef.scrollTop + commentsWrapperRef.clientHeight),'\n\n')
    const scrollFromBottom = commentsWrapperRef.scrollHeight- (commentsWrapperRef.scrollTop + commentsWrapperRef.clientHeight);
    console.log('scrollFromBottom after',scrollFromBottom, this.comments, selfComment)


    if(!this.snappedToBottom){
      this.snappedToBottom = true
      commentsWrapperRef.scrollTop = commentsWrapperRef.scrollHeight
      
    }else{
      if(scrollFromBottom <= 60 || selfComment){
 
        commentsWrapperRef.scrollTop = commentsWrapperRef.scrollHeight
      }
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

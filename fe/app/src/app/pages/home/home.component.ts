import { Component } from '@angular/core';
import { CommentsService } from 'src/app/services/comments.service'
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    title = 'home';
    comments = [
        /*{
            user:{},
            content:{
                data: 'placeholder'
            }
        },
        {
            user:{},
            content:{
                data: 'placeholder2'
            }
        }*/
    ]
    users = []
    constructor(private commentsService: CommentsService){
        console.log(this.commentsService)
    }

    sendComment(){
        this.commentsService.sendComment()
    }
    sendUser(){
        this.commentsService.sendUser('username')
    }

    ngOnInit(){
        /*this.commentsService.getComments().pipe(
            map(x => (
                (x as any).map(x => ({
                    users:{},
                    content:{
                        data:x.data
                    }
                }))
            ))
        ).subscribe(comments => {
           this.comments = comments

        })*/
        this.commentsService.getNewComment().subscribe(newComment => {
            console.log(newComment)
            this.comments.push({
                user:{},
                content:{
                    data: newComment.data
                }
            })
        })
        this.commentsService.getNewUser().subscribe(newUser => {
            console.log('newUser ',newUser)
            this.users.push({
                id: null,
                name: newUser.data
            })
        })
    }

}

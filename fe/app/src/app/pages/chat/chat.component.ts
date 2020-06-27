import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommentsService } from 'src/app/services/comments.service'
import { UserService } from 'src/app/services/user.service';


@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy{

/*
  @HostListener('window:beforeunload', [ '$event' ])
  beforeUnloadHandler(event) {
    // ...
  }
*/
//@HostListener('window:click', [ '$event' ])
@HostListener('window:beforeunload', [ '$event' ])
test(event) {
    console.log('window beforeunload')
    // todo - close connection
}
    username: string = null

    chatAuthenticated: boolean; 
    comments = []
    users: Array<{username: string, id?: string | number | null}> = []
    constructor(private commentsService: CommentsService, private userService: UserService){
        console.log(this.commentsService)

    }
    
    addComment(comment){
        if(comment){
            this.commentsService.sendComment(comment)
        }
    }
    /*sendComment(){
        // todo remove
       // this.commentsService.sendComment()
    }*/
    sendUser(){
        //this.commentsService.sendUser('username')
    }

    ngOnInit(){
        this.commentsService.openConnection();

        this.commentsService.getOldComments().subscribe(oldComments => {
        
            const updatedOldComments = oldComments.map(x => ({
                user:{
                    username: x.username
                },
                content:{
                    comment: x.comment
                },
            }))

            this.comments.unshift(...updatedOldComments)

        })
     
        this.commentsService.getNewComment().subscribe(newComment => {
            console.log(newComment)
            this.comments.push({
                user:{
                    username: newComment.username,
                },
                content:{
                   // data: newComment.data
                   comment: newComment.comment,
                   
                 
                }
            })
        })
        this.commentsService.getNewUser().subscribe(newUser => {
            console.log('newUser ',newUser)
            const { type } = newUser;
      

            if(type === 'signIn'){
                const { username } = newUser;
                const alreadyExists = this.users.find(x => x.username === username) !== undefined;
                if(!alreadyExists){
                    this.users.push({
                        id: null,
                        //name: username
                        username
                    })
                }
            }else if(type === 'signOut'){
                const { username } = newUser;
                if(username){
                    this.users = this.users.filter(x => x.username !== username);
                }
            
            }
            /*else if(type === 'getUsers'){
                const { users } = newUser;
                const updatedUsers = []
                users.forEach(({username}) => {
                    const alreadyExists = updatedUsers.find(x => x.name === username) !== undefined;
                    if(!alreadyExists){
                        updatedUsers.push({
                            name: username
                        })
                    }
                })
                this.users = updatedUsers; //users.map(x => ({name: x.username}))
            }*/

        })

        this.commentsService.getUsers().subscribe(newUsers => {
            const { users } = newUsers;
            const updatedUsers = []
            users.forEach(({username}) => {
                const alreadyExists = updatedUsers.find(x => x.name === username) !== undefined;
                if(!alreadyExists){
                    updatedUsers.push({
                        //name: username
                        username
                    })
                }
            })
            this.users = updatedUsers; //users.map(x => ({name: x.username}))

        })

        // user

        this.userService.getUser().subscribe(user => {
            if(user.username){
                this.username = user.username
            }
        })

        this.commentsService.isAuthenticated().subscribe((authenticated => {
            console.log('chatAuthenticated  ', authenticated)
            this.chatAuthenticated = authenticated;
      
        }))

    }

    ngOnDestroy(){

        this.commentsService.closeConnection();
    }

}

import { Injectable } from '@angular/core';
import { Subject, from, BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root',
})
export class CommentsService {          // rename to chatService
    private socket; 
    private commentSub; //= new Subject<any>();
    private commentsSub; //= new Subject<any[]>();
    private userSub; //= new Subject<any>();
    private comments;
    private authenticated: BehaviorSubject<boolean>;
    //private username: string;

    constructor(private userService: UserService) {
        this.comments = [];
        this.commentSub = new Subject<any>();
        this.commentsSub = new Subject<any[]>();
        this.userSub = new Subject<any>();

        this.authenticated = new BehaviorSubject(false);

        /*this.userService.getUser().subscribe(user => {
            if(user.username){
                this.username = user.username
            }
        })*/
        //this.socket = new WebSocket('ws://localhost:5001');

        //this.socket = new WebSocket('ws://localhost:5000');
        //this.socket.onopen = this.onOpen;
        //this.socket.onmessage = this.onMessage;

    }
    isAuthenticated = () => this.authenticated;

    openConnection = () => {
        console.log('openConnection')
        this.socket = new WebSocket('ws://localhost:5000');
        this.socket.onopen = this.onOpen;
        this.socket.onclose  = this.onClose ;
        this.socket.onmessage = this.onMessage;
    }

    closeConnection = () => {
        console.log('closeConnection')
        this.socket.close()
    }

    private onOpen = (event) => {
        console.log('onopen event:', event)

        this.signIn();
    }

    private onClose = (event) => {
        console.log('onclose  event:', event)

    }

    private signIn = () => {
        const accessToken = this.userService.getAccessToken();
        const refreshToken = this.userService.getRefreshToken();
        if(accessToken && refreshToken){
            this.socket.send(JSON.stringify({
                type: 'auth',
                data:  {
                    accessToken ,
                    refreshToken ,
                }
            }))
        }

    }
    private onSignInMessage = (data) => {
        const authenticated = data.authenticated || false;
        // get accessToken
        this.authenticated.next(authenticated)

    }

    private onMessage = (event) =>{
        console.log('onmessage event', event)
        const { data, type } = JSON.parse(event.data);
        console.log('onmessage data', data, type)


        if(type === 'auth'){
            this.onSignInMessage(data)
        }else if(type === 'comment'){
            const comment = {
                comment: data.comment,
                username: data.username
            }
            this.commentSub.next(comment);
            
            this.comments.push(comment);
            this.commentsSub.next(this.comments.slice())

        }else if(type === 'user'){
            const { type } = data;

            if(type === 'signIn' || type === 'signOut'){
                const user = {
                    username: data.username,
                    type: data.type,
                }
    
                this.userSub.next(user);
            }else if(type === 'getUsers'){
                const user = {
                    users: data.users,
                    type: data.type,
                }
    
                this.userSub.next(user);
            }

        }
    }

    sendComment(comment: string = ''){
        //this.socket.send( comment + ' ' + Math.random().toFixed(2) )
        this.socket.send(JSON.stringify({
            type: 'comment',
            //data: comment + ' ' + Math.random().toFixed(2) 
            data: {
                comment,
                //username: this.username
            }
        }))
    }
    /*private sendUser(user: string = ''){
    
        this.socket.send(JSON.stringify({
            type: 'user',
            data: user + ' ' + Math.random().toFixed(2) 
        }))
    }*/

    getNewComment(){
        return this.commentSub;
    }
    getComments(){
        return this.commentsSub;
    }

    getNewUser(){       // getUpdatedUsers
        return this.userSub;
    }

}
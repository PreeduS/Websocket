import { Injectable } from '@angular/core';
import { Subject, from, BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';

import { messageType, userType, CommentData, CommentsData, UserData, UsersData, AuthData } from 'src/app/commons/types/chat';
type MessageTypes = CommentData | CommentsData | UserData | UsersData | AuthData;

@Injectable({
  providedIn: 'root',
})
export class CommentsService {          // todo - rename to chatService
    private socket; 
    private commentSub: Subject<{username: string, comment: string}>; //= new Subject<any>();
    private commentsSub: Subject<Array<{comment: string, username: string}>>;
    private userSub: Subject<UserData['data']>; 
    private usersSub: Subject< UsersData['data']>; 
    private comments: Array<{comment: string, username: string}>;
    private authenticated: BehaviorSubject<boolean>;
    //private username: string;

    constructor(private userService: UserService) {
        this.comments = [];
        this.commentSub = new Subject<{username: string, comment: string}>();
        this.commentsSub = new Subject<Array<{comment: string, username: string}>>();
        this.userSub = new Subject<UserData['data'] >();
        this.usersSub = new Subject<UsersData['data']>();

        this.authenticated = new BehaviorSubject(false);

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
                type: messageType.auth,
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
       
        //const { data, type } = JSON.parse(event.data);
        const response = JSON.parse(event.data) as MessageTypes;
        const { data, type } = response
        //console.log('onmessage data', data, type)
        console.log('onmessage event', event, response)

        if(type === messageType.auth ){
            this.onSignInMessage(data)
        }else if(response.type === messageType.comment){
            const comment = {
                comment: response.data.comment,
                username: response.data.username
            } 

            this.commentSub.next(comment);
            
            //this.comments.push(comment);
            //this.commentsSub.next(this.comments.slice())

        }else if(response.type === messageType.comments){


            //this.commentSub.next(comment);
            console.log(' onmessage here ----  messageType.comments  ', messageType.comments, response)
            this.comments = [...response.data.comments]
            this.commentsSub.next(this.comments.slice())

        }
        else if(response.type === messageType.user ){
            //const { type } = response.data;

            if(response.data.type === userType.signIn  || response.data.type  === userType.signOut){
                const user = {
                    username: response.data.username,
                    type: response.data.type,
                }
    
                this.userSub.next(user);
            }/*else if(response.data.type === userType.getUsers){
                const user = {
                    users: response.data.users,
                    type: response.data.type,
                }
    
                this.userSub.next(user);
            }*/

        }
        else if(response.type === messageType.users ){
            const user = {
                users: response.data.users,
                //type: response.data.type,
            }

            this.usersSub.next(user);
        }
    }

    sendComment(comment: string = ''){

        this.socket.send(JSON.stringify({
            type: messageType.comment,
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
    //getComments(){      // getOlderComments
    getOldComments(){     
        return this.commentsSub;
    }

    getNewUser(){       // getUpdatedUsers
        return this.userSub;
    }
    getUsers(){        
        return this.usersSub;
    }

}
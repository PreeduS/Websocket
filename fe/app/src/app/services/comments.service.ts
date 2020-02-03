import { Injectable } from '@angular/core';
import { Subject, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {          // rename to chatService
    private socket; 
    private commentSub; //= new Subject<any>();
    private commentsSub; //= new Subject<any[]>();
    private userSub; //= new Subject<any>();
    private comments;


    constructor() {
        this.comments = [];
        this.commentSub = new Subject<any>();
        this.commentsSub = new Subject<any[]>();
        this.userSub = new Subject<any>();

        this.socket = new WebSocket('ws://localhost:5001');
        this.socket.onopen = this.onOpen;
        this.socket.onmessage = this.onMessage;
    }

    private onOpen = (event) => {
        console.log('onopen event:', event)

    }
    private onMessage = (event) =>{
        console.log('onmessage event', event)
        const { data, type } = JSON.parse(event.data);
        console.log('onmessage data', data, type)
        if(type === 'comment'){
            const comment = {
                data
            }
            this.commentSub.next(comment);
            
            this.comments.push(comment);
            this.commentsSub.next(this.comments.slice())

        }else if(type === 'user'){
            const user = {
                data
            }
            this.userSub.next(user)
        }
    }

    sendComment(comment: string = ''){
        //this.socket.send( comment + ' ' + Math.random().toFixed(2) )
        this.socket.send(JSON.stringify({
            type: 'comment',
            data: comment + ' ' + Math.random().toFixed(2) 
        }))
    }
    sendUser(user: string = ''){
    
        this.socket.send(JSON.stringify({
            type: 'user',
            data: user + ' ' + Math.random().toFixed(2) 
        }))
    }

    getNewComment(){
        return this.commentSub;
    }
    getComments(){
        return this.commentsSub;
    }

    getNewUser(){
        return this.userSub;
    }

}
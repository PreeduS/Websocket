import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';



interface User {
    username: string
}

@Injectable({
    providedIn: 'root',
})
export class UserService { 
    private user: Subject<User>;
    constructor(private http: HttpClient) { 
        this.user = new Subject<User>();
    }

    private setToken = () => {
        
    }
    private deleteToken = () => {

    }

    getUser = () =>  this.user;

    signIn = (username: string, password: string) => {

    }
    
    signUp = (username: string, password: string) => {
        //return this.http.post('auth/signUp',{
        return this.http.post('auth/signUp',{
            username,
            password

        }).pipe(map((x:any) => {
            console.log('z ',x); 
            const { token } = x;
            //set token
            return x;
        }))
    }
}

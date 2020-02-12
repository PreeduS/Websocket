import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

const ACCESS_TOKEN = 'ACCESS_TOKEN'


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

    // auth
    setAccessToken = (accessToken) => {
      localStorage.setItem(ACCESS_TOKEN, accessToken)
    }
    removeAccessToken = () => {
        localStorage.removeItem(ACCESS_TOKEN)
    }
    getAccessToken = () => {
        return localStorage.getItem(ACCESS_TOKEN)
    }

    getUser = () =>  this.user;

    signIn = (username: string, password: string) => {

    }
    
    signUp = (username: string, password: string) => {
        //return this.http.post('auth/signUp',{
        return this.http.get('auth/secret/jwt',{
           // username,
           // password

        }).pipe(
            map((x:any) => {
                console.log('z ',x); 
                const { accessToken } = x;
                //set token
                return x;
            })
            
     
        )
    }
}

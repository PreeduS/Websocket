import { Injectable } from '@angular/core';
import { throwError, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, first } from 'rxjs/operators';
import jwtDecode from 'jwt-decode'
import { UserJwtPayload, User } from 'src/app/commons/types/user';

const ACCESS_TOKEN = 'ACCESS_TOKEN';
const REFRESH_TOKEN = 'REFRESH_TOKEN';

 

@Injectable({
    providedIn: 'root',
})
export class UserService { 

    private user: ReplaySubject<User>;

    private getDecodedUser: (accessToken:string) => UserJwtPayload = (accessToken) => jwtDecode(accessToken)

    constructor(private http: HttpClient) { 
        this.user = new ReplaySubject<User>(1);
    }


    // access token
    setAccessToken = (accessToken) => {
      localStorage.setItem(ACCESS_TOKEN, accessToken)
    }
    removeAccessToken = () => {
        localStorage.removeItem(ACCESS_TOKEN)
    }
    getAccessToken = () => {
        return localStorage.getItem(ACCESS_TOKEN)
    }

    // refresh token
    setRefreshToken = (refreshToken) => {
        localStorage.setItem(REFRESH_TOKEN, refreshToken)
      }
    removeRefreshToken = () => {
        localStorage.removeItem(REFRESH_TOKEN)
    }
    getRefreshToken = () => {
        return localStorage.getItem(REFRESH_TOKEN)
    }

    getUser = () =>  this.user;

    isSignedIn = () =>
        this.getUser().pipe(map(user => !!user.username))
    

   
    initUser = () => {  
        const accessToken = this.getAccessToken();
        const refreshToken = this.getRefreshToken();
        if(accessToken && refreshToken){

            this.http.post('auth/tokenSignIn',{
                accessToken, refreshToken
            }).subscribe((response:any) => {
                console.log(response)
                const { valid, accessToken } = response;
                if(valid){
                    const decoded = this.getDecodedUser(accessToken);
  
                    this.setAccessToken(accessToken)
                    this.user.next({username: decoded.user.username})
                }else{
                    this.user.next({username: null})
                }
            },() => {
                this.user.next({username: null})
            })
        }else{
            this.user.next({username: null})
        }
        
        // first emit always used for signIn canActivate route  
  
    }
    signIn = (username: string, password: string) => {
        return this.http.post('auth/signIn',{
            username, password
        }).pipe(
            map((response:any) => {
    
                const { accessToken, refreshToken } = response;
                if(accessToken && refreshToken){
                    try{
                        const decoded = this.getDecodedUser(accessToken);
                        this.setAccessToken(accessToken);
                        this.setRefreshToken(refreshToken);
                        this.user.next({username: decoded.user.username})
                    }catch(error){
                        console.log('e ',error)
                    }

                }else{
                    return throwError('Access Token not returned')
                }   
                return response;
            })
        )
    }
    
    signOut(){
        this.removeRefreshToken();
        this.removeAccessToken();
        this.user.next({username: null})
    }

    signUp = (username: string, email: string, password: string) => {
        return this.http.post('auth/signUp',{
        //return this.http.get('auth/secret/jwt',{
            username,
            email,
            password

        }).pipe(
            map((x:any) => {
                console.log('z ',x); 
                const { accessToken } = x;
                //set token
                return x;
            })
            
     
        )
    }


    // canActivate routes
    canActivateSignIn(){
        return this.getUser()
        .pipe(
            first(),
            map( user => {
                if (!user.username){
                    return true;
                }else{
                    return false;
                }
            })
        )
    }
    /*canActivateSignOut(){
        return this.getUser()
        .pipe(
            // last ?
            map( user => {
                console.log('canActivateSignOut ', user)
                if (user.username){
                    return true;
                }else{
                    return false;
                }
            })
        )    
    }*/

    // settings
    resetPassword({token, username, password}){
        return this.http.post(`user/resetPassword/${token}`,{
            username, password
        })
    }

    imageUpload(base64Image){
        return this.http.post(`user/imageUpload/`,{
            image: base64Image
        })
    }

}

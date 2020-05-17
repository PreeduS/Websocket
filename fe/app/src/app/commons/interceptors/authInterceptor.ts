import { HttpInterceptor, HttpRequest, HttpClient, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, retry, switchMap, filter  } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { UserService } from 'src/app/services/user.service'
import { environment } from './../../../environments/environment';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private http: HttpClient, private userService: UserService) { }

 
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        const refreshToken = this.userService.getRefreshToken();
        let headers = new HttpHeaders()
        const accessToken = this.userService.getAccessToken();
        //const baseUrl = 'http://localhost:5000';
	    const baseUrl = environment.endpoint;
        console.log('accessToken', accessToken)
        if(accessToken){
         
            headers = headers.set('Authorization',accessToken)
        }

        const updatedReq = req.clone({
            headers,
            url: `${baseUrl}/${req.url}`
        });
     
        return next.handle(updatedReq).pipe(

          //  map((x:any) => {
            filter(e => e.type !== 0),
            catchError( (error, caught) => {
       
                const refreshTokenExpired = error.url.includes('/auth/getAccessToken');     // route for getting the access token returned error
                // Unauthorized
                if(refreshTokenExpired){
                    return throwError("refresh token expired")
                }
                if(error.status === 401 && !refreshTokenExpired && refreshToken){

                    
                    return this.http.post('auth/getAccessToken',{
                        refreshToken
                    }
                    ).pipe(
           
                        switchMap((result:any) => {
                   
                            this.userService.setAccessToken(result.accessToken)
                         
                            const updatedReq2 = updatedReq.clone({
                                headers: updatedReq.headers.set('Authorization',this.userService.getAccessToken()),
                            })
                            return next.handle(updatedReq2).pipe( 
                                filter(e => e.type !== 0),
                                retry(0)
                            )
                        }),
          
                        
                    )
             
                 
                   
                }
                return throwError(error)
            }),
            tap(
                val => console.log('tap val: ', val),
                err => console.log('tap err: ', err),
            )
        )

    }
}

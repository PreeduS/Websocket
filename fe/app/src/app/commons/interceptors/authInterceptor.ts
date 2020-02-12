import { HttpInterceptor, HttpRequest, HttpClient, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, map, catchError, retryWhen, retry, switchMap, filter  } from 'rxjs/operators';
import { Injector, Injectable } from '@angular/core';
import { UserService } from 'src/app/services/user.service'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
 
    constructor(private http: HttpClient, private userService: UserService) { }
 

    // todo - refetch token if expired here

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{

        let headers = new HttpHeaders()
        const accessToken = this.userService.getAccessToken();
        console.log('accessToken', accessToken)
        if(accessToken){
         
            headers = headers.append('Authorization',accessToken)
        }

        const updatedReq = req.clone({
            headers,
            url: `http://localhost:5000/${req.url}`
        });

        // return next.handle(updatedReq)
        return next.handle(updatedReq).pipe(

          //  map((x:any) => {
            filter(e => e.type !== 0),
            map((x:any) => {
                console.log('map ',x); 
               // const { accessToken } = x;
                //set token
                return x;
            }),
            catchError( (error/*, caught*/) => {
                console.log('catch err ',error, this.userService.getAccessToken())

                // Unauthorized
                if(error && error.status === 401){
                   // return this.injector.get(HttpClient).post('auth/signIn',{
                    //return this.http.post('auth/signIn',{
                    return  this.http.post('auth/signIn',{
                        username: 'testuser',
                        password: '12345678'
                    }).pipe(
                        map((result:any) => {
                           // this.accessToken = result.accessToken;
                           console.log('result ',result)
                            this.userService.setAccessToken(result.accessToken)
                            return result
                        }),
                        //switchMap(x => caught)
                       /* switchMap((result) => {
                            console.log('result2',result)
                           // updatedReq.headers.append('extraHeader2','2')
                            const updatedReq2 = updatedReq.clone({
                                headers: updatedReq.headers.append('Authorization',this.userService.getAccessToken()),
                            })
                            return next.handle(updatedReq2)//.pipe( filter(e => e.type !== 0))
                        })*/
                    )
             
                   // return caught
                }
                return throwError(error)
            }),
            //retry(1),
            //switchMap((x:any) =>{
            map((x:any) =>{
                console.log('----map2 ',x, this.userService.getAccessToken())
                //return next.handle(updatedReq)

                return x
       


            }),
            tap(
                val => console.log('tap val: ', val),
                err => console.log('tap err: ', err),
            )
        )

        /*
            return this.store.select('auth')
            .take(1)
            .switchMap( (authState: AuthState) =>  {
                const updatedReq = req.clone({
                    params: req.params.set('auth', authState.token)              
                });
                return next.handle(updatedReq);
            })
        */
    }
}
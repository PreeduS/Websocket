import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';



@Injectable({
    providedIn: 'root'
})

export class SignInGuardService implements CanActivate {

    constructor(private userService: UserService, private router: Router){ }


    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        return this.userService.canActivateSignIn().pipe(map(canActivate => {
            if(!canActivate){
                this.router.navigate(['/'])
            }
            return canActivate;
        }))
    }
}


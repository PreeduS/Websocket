import { CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';




export class SignInGuardService implements CanActivate {

    constructor(private userService: UserService, private router: Router){
        
    }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        return this.userService.getUser().pipe(map( user => {
            if (user === null){
                return true
            }else{
                this.router.navigate(['/'])
                return false
            }
        }))
    }
}


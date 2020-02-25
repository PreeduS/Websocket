import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignInGuardService } from 'src/app/services/sign-in-guard.service';

import { ChatComponent } from 'src/app/pages/chat/chat.component';
import { RegisterComponent } from 'src/app/pages/register/register.component';
import { SignInComponent } from 'src/app/pages/sign-in/sign-in.component';

// SignOutGuardService
const appRoutes: Routes = [
    { path: '', component: ChatComponent },
    { path: 'register', canActivate: [SignInGuardService], component: RegisterComponent },
    { path: 'signin', canActivate: [SignInGuardService], component: SignInComponent },
   // { path: 'signin', component: SignInComponent },

]


@NgModule({
    imports: [
       RouterModule.forRoot(appRoutes)
    ],
    exports:[RouterModule]

})

export class AppRoutingModule { }
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignInGuardService } from 'src/app/services/sign-in-guard.service';

import { HomeComponent } from 'src/app/pages/home/home.component';
import { RegisterComponent } from 'src/app/pages/register/register.component';
import { SignInComponent } from 'src/app/pages/sign-in/sign-in.component';


const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'register', component: RegisterComponent },
  //  { path: 'signin', canActivate: [SignInGuardService], component: SignInComponent },
    { path: 'signin', component: SignInComponent },

]


@NgModule({
    imports: [
       RouterModule.forRoot(appRoutes)
    ],
    exports:[RouterModule]

})

export class AppRoutingModule { }
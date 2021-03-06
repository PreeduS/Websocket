import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignInGuardService } from 'src/app/services/sign-in-guard.service';

import { ChatComponent } from 'src/app/pages/chat/chat.component';
import { RegisterComponent } from 'src/app/pages/register/register.component';
import { SignInComponent } from 'src/app/pages/sign-in/sign-in.component';
import { ResetPasswordComponent } from 'src/app/pages/user/callback/reset-password/reset-password.component';
import { SettingsComponent } from 'src/app/pages/user/settings/settings.component';



// SignOutGuardService
const appRoutes: Routes = [
    { path: '', component: ChatComponent },
    { path: 'register', canActivate: [SignInGuardService], component: RegisterComponent },
    { path: 'signin', canActivate: [SignInGuardService], component: SignInComponent },
    // { path: 'signin', component: SignInComponent },
    { path: 'user/callback/resetpassword/:token', component: ResetPasswordComponent },
    { path: 'user/settings', component: SettingsComponent },

]


@NgModule({
    imports: [
       RouterModule.forRoot(appRoutes)
    ],
    exports:[RouterModule]

})

export class AppRoutingModule { }
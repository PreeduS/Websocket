import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from 'src/app/commons/interceptors/authInterceptor';
import { AppRoutingModule } from './router/routing.modulte'; 

import { AppComponent } from './app.component';
import { ChatComponent } from './pages/chat/chat.component';
import { ChatHeaderComponent } from './pages/chat/chat-header/chat-header.component';


//import { CommentsService } from './services/comments.service';
import { RegisterComponent } from './pages/register/register.component';
import { HeaderComponent } from './commons/components/structure/header/header.component';
import { InputComponent } from './commons/components/input/input.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { ChatFooterComponent } from './pages/chat/chat-footer/chat-footer.component';
import { ChatBodyComponent } from './pages/chat/chat-body/chat-body.component';
import { ChatCommentComponent } from './pages/chat/chat-body/chat-comment/chat-comment.component';
import { ResetPasswordComponent } from './pages/user/callback/reset-password/reset-password.component';
import { SettingsComponent } from './pages/user/settings/settings.component';
import { ProfileComponent } from './pages/user/settings/subpages/profile/profile.component';
import { PasswordComponent } from './pages/user/settings/subpages/password/password.component';
import { SidemenuComponent } from './pages/user/settings/sidemenu/sidemenu.component';
import { ButtonComponent } from './commons/components/button/button.component';

 

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    ChatHeaderComponent, 
    RegisterComponent,
    HeaderComponent,
    InputComponent,
    SignInComponent,
    ChatFooterComponent,
    ChatBodyComponent,
    ChatCommentComponent,
    ResetPasswordComponent,
    SettingsComponent,
    ProfileComponent,
    PasswordComponent,
    SidemenuComponent,
    ButtonComponent,
    

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
  //  CommentsService
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

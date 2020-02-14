import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from 'src/app/commons/interceptors/authInterceptor';
import { AppRoutingModule } from './router/routing.modulte'; 

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';


//import { CommentsService } from './services/comments.service';
import { RegisterComponent } from './pages/register/register.component';
import { HeaderComponent } from './commons/components/structure/header/header.component';
import { InputComponent } from './commons/components/input/input.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
 

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    HeaderComponent,
    InputComponent,
    SignInComponent, 
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

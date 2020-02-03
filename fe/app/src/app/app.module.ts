import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './router/routing.modulte'; 

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';


import { CommentsService } from './services/comments.service';
import { RegisterComponent } from './pages/register/register.component';
import { HeaderComponent } from './commons/components/structure/header/header.component';
import { InputComponent } from './commons/components/input/input.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    HeaderComponent,
    InputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
  //  CommentsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

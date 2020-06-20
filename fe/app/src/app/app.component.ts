import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  username: string | null = null;
  constructor( private userService: UserService, private router: Router ) { }

  ngOnInit(){
    this.userService.getUser().subscribe(user => {
      this.username = user.username;
   
    })

    this.userService.initUser();
    
  }

  signOut(){
    console.log('signOut')
    this.userService.signOut()
    //this.router.navigate(['/'])
    window.location.href = '/'
  }
}

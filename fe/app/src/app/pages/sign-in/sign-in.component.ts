import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.signInForm = new FormGroup({
      username: new FormControl(null, [
        Validators.required, 
        Validators.minLength(6), 
      ]),
      password: new FormControl(null, [
        Validators.required, 
        Validators.minLength(6), 
      ]),
 

    })
  }

  onSubmit(){
    // todo add redirect
    const { valid } = this.signInForm
 
    const { username, password } = this.signInForm.value;
 
    this.userService.signIn(username, password).subscribe(
      res => console.log(res),
      err => console.log(err)
    )

  } 
}

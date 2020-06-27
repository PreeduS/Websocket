import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { getUsernameErrorLabel, getPasswordErrorLabel } from 'src/app/commons/helpers/validation';
import { validation } from 'src/app/commons/constants/config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;
  private isSubmitted = false;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.signInForm = new FormGroup({
      username: new FormControl(null, [
        Validators.required, 
        Validators.minLength(validation.username.length.min), 
      ]),
      password: new FormControl(null, [
        Validators.required, 
        Validators.minLength(validation.password.length.min), 
      ]),
 

    })
  }

  getUsernameError = () => {
    const formControl = this.signInForm.get('username');
    return getUsernameErrorLabel(formControl, this.isSubmitted);
  }

  getPasswordError = () => {
    const formControl = this.signInForm.get('password');
    return getPasswordErrorLabel(formControl, this.isSubmitted);
  }
  onSubmit(){
    // todo add redirect
    const { valid } = this.signInForm
    this.isSubmitted = true;
    const { username, password } = this.signInForm.value;
 
    this.userService.signIn(username, password).subscribe(
      res => {
        console.log(res)
        //this.router.navigate(['/'])
        window.location.href = '/'
      },
      err => console.log(err)
    )

  } 
}

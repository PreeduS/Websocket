import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/services/user.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  signUpForm: FormGroup;
  //username = '';
  //password = '';
  //password2 = '';

  private isSubmitted = false;

  constructor(private formBuilder: FormBuilder, private userService: UserService) { }

  hasGeneralError(formControl){
   
    return (
      (this.isSubmitted && !formControl.valid)  || 
      (!formControl.valid && formControl.touched)
    )
  }

  // labels
  getPasswordError(){
    const formControl = this.signUpForm.get('passwordGroup.password');

    if(this.hasGeneralError(formControl)){
      if(formControl.errors.required){
        return 'Please provide a value';
      }
      if(formControl.errors.minlength){
        return `At least ${formControl.errors.minlength.requiredLength} characters are required`
      }
      return 'Invalid password'
    }
    return ''
  }

  getUsernameError(){
    const formControl = this.signUpForm.get('username');

    if(this.hasGeneralError(formControl)){
      if(formControl.errors.required){
        return 'Please provide a value';
      }
      if(formControl.errors.minlength){
        return `At least ${formControl.errors.minlength.requiredLength} characters are required`
      }

      return 'Invalid username'
    }
    return ''

  }
  getPassword2Error(){
    const formControl = this.signUpForm.get('passwordGroup.password2');

    if(this.hasGeneralError(formControl)){
      if(formControl.errors.required){
        return 'Please provide a value';
      }
      if(formControl.errors.minlength){
        return `At least ${formControl.errors.minlength.requiredLength} characters are required`
      }

      return 'Invalid password'
    }
    return ''
  }
  getPasswordMatchError(){
    const formGroup = this.signUpForm.get('passwordGroup');
    const formControl = this.signUpForm.get('passwordGroup.password2');

    if(this.isSubmitted || formControl.touched){
      if(formGroup.errors && formGroup.errors.passwordMatch){
        return `Passwords do not match`
      }
    }

    return ''
  }

 
  doPasswordsMatch = (formGroup: FormGroup): {[key:string]: boolean} =>{
 //   console.log('formGroup ',formGroup.controls)
 
      const password  = formGroup.controls.password.value
      const password2  = formGroup.controls.password2.value
   
    //  console.log(password, password2)
      if(password !== password2){
        return {'passwordMatch': true};
      }
 
    return null
}

 
  ngOnInit() {
    this.signUpForm = new FormGroup({
      username: new FormControl(null, [
        Validators.required, 
        Validators.minLength(6),
        Validators.pattern(/^[a-zA-Z\- ]+$/)
      ]),
     // passwordGroup: new FormGroup({
      passwordGroup: this.formBuilder.group({
        password: new FormControl(null, [
          Validators.required, 
          Validators.minLength(6),
       //   this.doPasswordsMatch,
  
          Validators.pattern(/^[a-zA-Z\- ]+$/)
        ]),
          
        password2: new FormControl(null, [
          Validators.required, 
          
          //this.doPasswordsMatch,
          Validators.pattern(/^[a-zA-Z\- ]+$/)
        ]),
        
      },
      {validators: this.doPasswordsMatch, updateOn:'change' }

      ),

    })
  }


  onSubmit(){
    console.log(this.signUpForm)
    const { valid } = this.signUpForm
    this.isSubmitted = true;
    this.userService.signUp('testuser3','12345678').subscribe(
      res => console.log(res),
      err => console.log(err)
    )

  } 

}

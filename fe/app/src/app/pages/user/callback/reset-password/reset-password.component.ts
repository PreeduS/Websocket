import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, first } from 'rxjs/operators';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
    resetPasswordForm: FormGroup;
    isSubmitted =false
    token: string = null;
    constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private userService: UserService) { }


    hasGeneralError(formControl){
   
        return (
          (this.isSubmitted && !formControl.valid)  || 
          (!formControl.valid && formControl.touched)
        )
      }
    
      // labels
      getPasswordError(){
        const formControl = this.resetPasswordForm.get('passwordGroup.password');
    
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
        const formControl = this.resetPasswordForm.get('username');
    
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
        const formControl = this.resetPasswordForm.get('passwordGroup.password2');
    
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
        const formGroup = this.resetPasswordForm.get('passwordGroup');
        const formControl = this.resetPasswordForm.get('passwordGroup.password2');
    
        if(this.isSubmitted || formControl.touched){
          if(formGroup.errors && formGroup.errors.passwordMatch){
            return `Passwords do not match`
          }
        }
    
        return ''
      }
    

    doPasswordsMatch = (formGroup: FormGroup): {[key:string]: boolean} =>{

            const password  = formGroup.controls.password.value
            const password2  = formGroup.controls.password2.value
        

            if(password !== password2){
            return {'passwordMatch': true};
            }
        
           return null
       }

    ngOnInit() {
        this.route.paramMap
        .pipe(
            first()
        )
        .subscribe(params => {

            this.token = params.get('token')
        });

        

        this.resetPasswordForm = new FormGroup({
            username: new FormControl(null, [
              Validators.required, 
              Validators.minLength(6),
           //   Validators.pattern(/^[a-zA-Z\- ]+$/)
            ]),
           // passwordGroup: new FormGroup({
            passwordGroup: this.formBuilder.group({
              password: new FormControl(null, [
                Validators.required, 
                Validators.minLength(6),
              //  Validators.pattern(/^[a-zA-Z\- ]+$/)
              ]),
                
              password2: new FormControl(null, [
                Validators.required, 
             //   Validators.pattern(/^[a-zA-Z\- ]+$/)
              ]),
              
            },
            {validators: this.doPasswordsMatch, updateOn:'change' }
      
            ),
      
          })


    }

    
  onSubmit(){
 
    const { valid } = this.resetPasswordForm
    this.isSubmitted = true;

    if(!valid){return;}
        this.userService.resetPassword({
            token: this.token,
            username: this.resetPasswordForm.value.username,
            password: this.resetPasswordForm.value.passwordGroup.password
        }).subscribe(res => console.log(res))
  } 

}

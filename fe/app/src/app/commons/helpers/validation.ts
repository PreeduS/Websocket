import { AbstractControl } from "@angular/forms"

const hasGeneralError = (formControl: AbstractControl, isSubmitted: boolean = true) => {
   
    return (
      (isSubmitted && !formControl.valid)  || 
      (!formControl.valid && formControl.touched)
    )
}


export const getUsernameErrorLabel = (formControl: AbstractControl, isSubmitted: boolean = true): string => {
 

    if(hasGeneralError(formControl, isSubmitted)){
        if(formControl.errors.required){
            return 'Please provide a value';
        }
        if(formControl.errors.minlength){
            return `At least ${formControl.errors.minlength.requiredLength} characters are required`;
        }

        return 'Invalid username';
    }
    return '';

}


export const getPasswordErrorLabel = (formControl: AbstractControl, isSubmitted: boolean = true): string => {

    if(hasGeneralError(formControl, isSubmitted)){
      if(formControl.errors.required){
        return 'Please provide a value';
      }
      if(formControl.errors.minlength){
        return `At least ${formControl.errors.minlength.requiredLength} characters are required`;
      }
      return 'Invalid password';
    }
    return '';
  }
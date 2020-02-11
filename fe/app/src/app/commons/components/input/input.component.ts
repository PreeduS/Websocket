import { Component, OnInit, Input, Output, EventEmitter, Self, Optional } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit, ControlValueAccessor {
  @Input() value: String; 
  @Input() type: String = 'text'; 
  @Input() label?: String; 
  @Input() error?: String; 
  @Output() valueChange = new EventEmitter<string>();

  @Input() width: String = '10rem'
 // @Input() formControlName;

  getInputStyles = () => ({
    width: this.width
  })
  
  onChange(value){
    console.log('onChange ',value)
    this.valueChange.emit(value)
  }
  onTouched(){ }
  ngOnInit() {
  
  }
  
 
  constructor(
    @Self()
    @Optional()
    private ngControl: NgControl
  ) { 

    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    

    }
  }


  writeValue(value) {
    this.value = value;
    //this.onChange(value)
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    //this.disabled = isDisabled;
  }

}


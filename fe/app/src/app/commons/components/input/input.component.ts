import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  @Input() value: String; 
  @Output() valueChange = new EventEmitter<string>();

  constructor() { }
  onChange(value){
    console.log('onChange ',value)
    this.valueChange.emit(value)
  }
  ngOnInit() {

  }

}


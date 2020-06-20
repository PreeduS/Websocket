import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
   // @Input() label?: String = 'Button';
    //@Input() type? = 'button';
    @Input() submit?: boolean = false;
    @Input() disabled?: boolean = false; 
    @Input() themeStyle?: Object = {}; 
    @Input() width?: string = 'auto';
    @Output() click? = new EventEmitter<any>();
    
    constructor() { }
    
    getInputStyles = () => ({
        width: this.width,
        cursor: this.disabled ? 'default' : 'pointer',
        ...this.themeStyle
    })

    ngOnInit() {
      
    }

    onClick = (event) => {
        //this.click.emit(event);
    }



}

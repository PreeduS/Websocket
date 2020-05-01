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
    @Output() click? = new EventEmitter<any>();
    constructor() { }
    
    ngOnInit() {

    }

    onClick = (event) => {
        //this.click.emit(event);
    }



}

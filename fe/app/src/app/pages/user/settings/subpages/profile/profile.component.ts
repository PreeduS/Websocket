import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
  }


  upload = (e, callback) => {
    const file = e.target.files[0];
    if(!file){ 
      return; 
    }

    const fileName = file.name;            
    const type = file.type;            
    const sizeKB = (file.size / 1024).toFixed(2);
    const reader = new FileReader();
    reader.readAsDataURL(file); 

    reader.onload = event => {

        const img:any = new Image();
        if(!event || !event.target){return;}
        const result = (event.target as any).result;
        img.src = result;
        img.addEventListener('load',() =>{
            const { width, height } = img;
            
            callback({
                result,
                fileName,
                type,
                sizeKB,
                width,
                height,
            
            });

        })

        
  
        
    } 

}


  imageUpload = e => this.upload(e, 
    x => this.userService.imageUpload(x.result).subscribe(res => console.log(res))
  )

}

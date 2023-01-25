import { Component, OnInit, OnChanges } from '@angular/core';
import { ImageService } from 'src/app/Service/image.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnChanges {
  image:any
  selecetedFile=null
  user = JSON.parse(localStorage.getItem('user') || '')
  img = document.getElementById('image')
  constructor(private imageService: ImageService) { }

  ngOnChanges():void{

  }

  ngOnInit(): void {

this.imageService.getMetadata(this.user.uid).then((res:any)=>{
      console.log(res);
      this.image=res
      const img = document.getElementById('images')
      img!.setAttribute("src", res)
console.log(document.getElementById('images'));
    })


  }
  fileSelected(event:any){
    this.selecetedFile = event.target.files[0];
    console.log(event)
  }
  imageUpload(){

    this.imageService.imageUploadService(this.selecetedFile,this.user.uid)
  }

}

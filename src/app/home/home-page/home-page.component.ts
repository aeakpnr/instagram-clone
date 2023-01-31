import { Component, OnInit, OnChanges } from '@angular/core';
import { StorageReference } from 'firebase/storage';
import { ImageService } from 'src/app/Service/image.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnChanges {
  image:any
  selecetedFile=null
  postsArray:any=[]
  denemeArray: any =[]
  user = JSON.parse(localStorage.getItem('user') || '')
  img:any
  constructor(private imageService: ImageService) { }

  ngOnChanges():void{

  }

  ngOnInit(): void {

// this.imageService.getMetadata(this.user.uid).then((res:any)=>{
//       console.log(res);
//       this.image=res
//       const img = document.getElementById('images')
//       img!.setAttribute("src", res)
// console.log(document.getElementById('images'));
//     })
    this.imageService.getPosts(this.user.uid).then((res:any)=>{
      this.postsArray=res
      this.img = document.getElementById('images')
      this.img!.setAttribute("src", res[1])
    })
    console.log(this.postsArray);


  }
  fileSelected(event:any){
    this.selecetedFile = event.target.files[0];
    console.log(event)
  }
  imageUpload(){

    this.imageService.postService(this.selecetedFile,this.user.uid)
  }

}

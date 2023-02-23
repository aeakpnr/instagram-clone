import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { userPosts } from '../classes/user-posts';
import { AuthService } from '../Service/auth.service';
import { DbService } from '../Service/db-service.service';
import { ImageService } from '../Service/image.service';
declare var bootstrap: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  selecetedFile=null
  postForm = new FormGroup ({
    postText:new FormControl(''),
  })
  user = JSON.parse(localStorage.getItem('user') || '');
  userName: any;
  deneme: any;
  userDb = this.dbService.getUserData(this.user.uid);
  isFollow!:boolean

  constructor(
    private authService: AuthService,
    private router: Router,
    private dbService: DbService,
    private imageService: ImageService,
    private postClass: userPosts
  ) {}

  ngOnInit(): void {



  }
  create(click: boolean) {
    const createPost = new bootstrap.Modal(
      document.getElementById('createModal')
    );
    if (click) {
      createPost.show();
    } else {
      createPost.hide();
    }
  }
  fileSelected(event: any) {
    this.selecetedFile = event.target.files[0]
    const inputImage:any = document.getElementById('image')
    const chosenImage : any = document.getElementById('chosen-image')
    let reader = new FileReader();
    reader.readAsDataURL(inputImage.files[0]);
    console.log(inputImage.files[0]);
    reader.onload = () =>{
      chosenImage.setAttribute("src", reader.result)
      console.log(reader.result);

    }


  }
  imageUpload() {
    this.imageService.postService(this.selecetedFile, this.user.uid).then((res)=>{
      this.dbService.getUserData(this.user.uid).then((res)=>{

        this.userName=res.username
  console.log('DENEME: ',this.userName);
      })
      console.log(res);
      let date: Date = new Date();
      const postClass : userPosts = {
        text: this.postForm.value.postText,
        date: date,
        url: res,
        username:this.user.username,

      }
      this.dbService.userPostDb(postClass,this.userName)

    });
  }
}

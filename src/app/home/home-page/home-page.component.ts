import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { StorageReference } from 'firebase/storage';
import { DbService } from 'src/app/Service/db-service.service';
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
  imageArray:Array<any>=[]
  allPostsArray:any =[]
  constructor(private imageService: ImageService, private dbService: DbService) { }

  ngOnChanges():void{

  }

  ngOnInit(): void {
    this.dbService.postsListining('akpınar')
    // this.dbService.getUserData(this.user.uid).then((res)=>{
    //   // const followingPosts: Array <any> =Object.values(res.following)
    //   // const followingPostsArray: any = []

    //   // followingPosts.forEach((posts:any,i:any) =>{
    //   //   followingPostsArray.push(Object.values(posts.posts))
    //   //   this.allPostsArray = this.allPostsArray.concat(followingPostsArray[i])



    //   // })

    //   // const myPosts = Object.values(res.posts)


    //   // console.log('My POSTS: ',myPosts);
    //   // console.log('Following: ',this.allPostsArray);

    // })
  }




}

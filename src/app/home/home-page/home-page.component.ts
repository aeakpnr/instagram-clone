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
  userName:any
  selecetedFile=null
  postsArray:any=[]
  denemeArray: any =[]
  user = JSON.parse(localStorage.getItem('user') || '')
  imageArray:Array<any>=[]
  allPostsArray:any =[]
  profilePhotoList:Array<any>=[]
  followingList:any=[]
  postList:any=[]
  constructor(private imageService: ImageService, private dbService: DbService) { }

  ngOnChanges():void{

  }

  ngOnInit(): void {
    this.dbService.getUserData(this.user.uid).then((res)=>{
      this.userName = res.username
      this.followingList=[]
      if(res.following){
        this.followingList.push(Object.keys(res.following))
        console.log(this.followingList[0]);

      }

      this.imageService.getProfilePhotolist(this.user.uid).then((res:Array<any>)=>{
        this.profilePhotoList=res
      }).then((res)=>{
        console.log(this.profilePhotoList);
        this.dbService.postsListining(this.followingList[0],this.userName).then((res:Array<any>)=>{
          this.postList
          const postArray: Array<any>= res
          console.log('POST LİST: ',postArray);
          postArray.forEach(posts =>{


            this.profilePhotoList.forEach(photos =>{

              if(posts.uid==photos.uid){
                this.postList.push(Object.assign(posts, photos))
            }
            })

          })
          console.log(this.postList);

      })
      })

    })




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

import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { StorageReference } from 'firebase/storage';
import { object } from 'rxfire/database';
import { userPosts } from 'src/app/classes/user-posts';
import { DbService } from 'src/app/Service/db-service.service';
import { ImageService } from 'src/app/Service/image.service';
import { ModalService } from 'src/app/Service/modal.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnChanges {
  likesArray:any=[]
  likeButtonClick:boolean=false
  unLikeButtonClick:boolean=false
  name:any
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
  constructor(private imageService: ImageService, private dbService: DbService, private modalService:ModalService) { }

  ngOnChanges():void{

  }

  ngOnInit(): void {


    this.dbService.getUserData(this.user.uid).then((res)=>{
      console.log(res);
      this.name=res.name
      this.userName = res.username
      this.followingList=[]
      if(res.following){
        this.followingList.push(Object.keys(res.following))
        console.log(this.followingList[0]);

      }

      this.imageService.getProfilePhotolist().then((res:Array<any>)=>{
        this.profilePhotoList=res
      }).then((res)=>{
        console.log(this.profilePhotoList);
        this.dbService.postsListining(this.followingList[0],this.userName).then((res:Array<any>)=>{

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
  }

  likeButton(post:any){
      const obj = {
        name: this.name,
        username: this.userName,
        uid:this.user.uid
  }
  this.dbService.postLike(post,obj).then(()=>{
    this.dbService.getOnePost(post.postUid).then((res:userPosts)=>{
      this.postList.forEach((element:any,index:number) =>{
        if(element.postUid==post.postUid){
          this.postList[index].likes=res.likes
        }
      })
    })
  })
  this.likeButtonClick=true
}
unLiked(post:any){

  this.dbService.postUnLike(post,this.userName).then(()=>{
    this.dbService.getOnePost(post.postUid).then((res:userPosts)=>{
      this.postList.forEach((element:any,index:number) =>{
        if(element.postUid==post.postUid){
          this.postList[index].likes=res.likes
        }
      })
    })
  })
  this.likeButtonClick=false

}
likesModal(post:userPosts){
  const likeUsers = post.likes.likeUsers
  console.log(Object.values(post.likes.likeUsers));



  this.modalService.followingModal(likeUsers).then((res)=>{
    this.likesArray=res

  })
}
}

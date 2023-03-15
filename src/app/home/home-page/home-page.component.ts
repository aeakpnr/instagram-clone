import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { getDatabase, onValue, ref } from 'firebase/database';
import { StorageReference } from 'firebase/storage';
import { object } from 'rxfire/database';
import { userPosts } from 'src/app/classes/user-posts';
import { DbService } from 'src/app/Service/db-service.service';
import { ImageService } from 'src/app/Service/image.service';
import { ModalService } from 'src/app/Service/modal.service';
declare var bootstrap: any;
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit, OnChanges {
  isFollowing!:boolean
  likesArray: any = [];
  likeButtonClick: boolean = false;
  unLikeButtonClick: boolean = false;
  myName: any;
  myUserName: any;
  selecetedFile = null;
  postsArray: any = [];
  denemeArray: any = [];
  user = JSON.parse(localStorage.getItem('user') || '');
  imageArray: Array<any> = [];
  allPostsArray: any = [];
  profilePhotoList: Array<any> = [];
  followingList: any = [];
  postList: any = [];
  db=getDatabase()

  constructor(
    private imageService: ImageService,
    private dbService: DbService,
    private modalService: ModalService
  ) {}

  ngOnChanges(): void {}

  ngOnInit(): void {

    this.dbService.getUserData(this.user.uid).then((res) => {
      console.log(res);
      this.myName = res.name;
      this.myUserName = res.username;
const referance = ref(this.db, `users/`+this.user.uid+'/follow/following');
    onValue(referance, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      this.followingList = [];
      if (data) {
        this.followingList.push(Object.keys(data));
        console.log(this.followingList[0]);
      }


    });

      this.imageService
        .getProfilePhotolist()
        .then((res: Array<any>) => {
          this.profilePhotoList = res;
        })
        .then((res) => {
          console.log(this.profilePhotoList);
          this.dbService
            .postsListining(this.followingList[0], this.myUserName)
            .then((res: Array<any>) => {
              const postArray: Array<any> = res;
              console.log('POST LİST: ', postArray);
              postArray.forEach((posts) => {
                this.profilePhotoList.forEach((photos) => {
                  if (posts.uid == photos.uid) {
                    this.postList.push(Object.assign(posts, photos));
                  }
                });
              });
              console.log(this.postList);
            });
        });
    });
  }

  likeButton(post: any) {
    const obj = {
      name: this.myName,
      username: this.myUserName,
      uid: this.user.uid,
    };
    this.dbService.postLike(post, obj).then(() => {
      this.dbService.getOnePost(post.postUid).then((res: userPosts) => {
        this.postList.forEach((element: any, index: number) => {
          if (element.postUid == post.postUid) {
            this.postList[index].likes = res.likes;
          }
        });
      });
    });
    this.likeButtonClick = true;
  }
  unLiked(post: any) {
    this.dbService.postUnLike(post, this.myUserName).then(() => {
      this.dbService.getOnePost(post.postUid).then((res: userPosts) => {
        this.postList.forEach((element: any, index: number) => {
          if (element.postUid == post.postUid) {
            this.postList[index].likes = res.likes;
          }
        });
      });
    });
    this.likeButtonClick = false;
  }
  likesModal(post: userPosts) {
    const likeUsers = post.likes.likeUsers;
    console.log(Object.values(post.likes.likeUsers));

    this.modalService.followingModal(likeUsers).then((res) => {
      this.likesArray = res;
      const modal =new bootstrap.Modal(document.getElementById('likeModal'))
      modal.show()
    });

  }
  likeControl(item:any){

    return this.myUserName!=item.username ? true : false
  }
  followControl(item:any){
    this.isFollowing =this.followingList[0].includes(item.username)
    return this.isFollowing;
  }
  follow(item:any){
    const follow = {
      uName: item.username,
      name: item.name,
    };
    const followers = {
      uName: this.myUserName,
      name: this.myName,
    };
    console.log(item);

    this.dbService.dbFollow(follow, followers, item.uid).then((res) => {
      this.isFollowing=true
    });
  }
  unFollow(item:any){
    this.dbService
    .dbUnfollow(item.username, item.uid, this.myUserName)
    .then((res) => {
      this.isFollowing=false
    });
  }
}

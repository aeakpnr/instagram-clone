import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { object } from 'rxfire/database';
import { userNameList } from 'src/app/classes/user-name-list';
import { DbService } from 'src/app/Service/db-service.service';
import { ImageService } from 'src/app/Service/image.service';
import { ModalService } from 'src/app/Service/modal.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  // user = JSON.parse(localStorage.getItem('user') || '')
  profilePhotoList:Array<any>=[]
  followingListModal!:Array<any>;
  followersListModal:any;
  followingList:any;
  followersList: any;
  profileUser: any;
  profileUid!: boolean;
  isFollowing!: boolean;
  profilePosts: any;
  selecetedFile = null;
  user = JSON.parse(localStorage.getItem('user') || '');
  userNameRoute: any = this.router.snapshot.paramMap.get('username');
  userData: any;
  userUid!: string;
  editText: boolean = false;
  profileTextValue!: any;
  imageArray: Array<any> = [];
  userPhoto: any;
  myUserName: any;
  myName: any;
  noPost: boolean = false;
  followingCount!: number;
  followersCount!: number;
  constructor(
    private router: ActivatedRoute,
    private dbService: DbService,
    private imageService: ImageService,
    private modalService: ModalService
  ) {}
  textForm = new FormGroup({
    profileText: new FormControl(''),
  });

  userNameList = this.dbService.getUserUid();
  ngOnInit(): void {
    console.log(this.userNameRoute);

    this.userNameList
      .then((res: object) => {
        this.userUid = Object.getOwnPropertyDescriptor(
          res,
          this.userNameRoute!
        )?.value;
        if (this.user.uid == this.userUid) {
          this.profileUid = true;
        } else {
          this.profileUid = false;
        }
        this.imageService.getProfilePhoto(this.userUid).then((res) => {
          this.userPhoto = res;
          const profilPhoto: any = document.getElementById('profilePhoto');
          profilPhoto.setAttribute('src', this.userPhoto);
        });
        this.imageArray = this.imageService.getPosts(this.userUid);

        return this.userUid;
      })
      .then((res) => {
        this.dbService.getUserData(this.userUid).then((res) => {
          if(res.following){
            this.followingList=res.following
            console.log(this.followingList);

            this.followingCount=Object.keys(res.following).length

          }
          else{
            this.followingCount=0
          }
          if(res.followers){
            this.followersList=res.followers
            console.log(this.followersList);

            this.followersCount=Object.keys(this.followersList).length
          }
          else{
            this.followersCount=0
          }

          // this.followingCount =
          //   res.following != null || res.following != undefined
          //     ? Object.keys(res.following).length
          //     : 0;

          // this.followersCount =
          //   res.followers || res.followers != undefined
          //     ? Object.keys(res.followers).length
          //     : 0;
          // console.log(this.followingCount);

          console.log('PROFİL SAHİBİ VERİLERİ: ', res);
          console.log('KULLANICI SAHİBİ UİD: ', this.user.uid);

          this.dbService.getUserData(this.user.uid).then((res) => {
            this.myUserName = res.username;
            this.myName = res.name;
            if(this.myUserName!=this.userNameRoute){
              if(Object.hasOwn(this.followersList,this.myUserName)){
              this.isFollowing=true
            }
            else{
              this.isFollowing=false
            }
            }

          });

          this.dbService.getPosts(res.username).then((res) => {
            console.log('////////////', res);

            if (res) {
              this.profilePosts = res;
            } else {
              this.profilePosts = false;
              this.noPost = true;
            }
          });

          const array: Array<any> = [];
          array.push(res);
          this.profileUser = res;

          this.userData = array;

          document.getElementById('profile-name')!.innerHTML = res.name;
          document.getElementById('profile-username')!.innerHTML = res.username;
          document.getElementById('text-profile')!.innerHTML =
            res.text.profileText;
        });
      });
  }
  textEdit() {
    this.editText = !this.editText;
  }
  textArea() {
    this.dbService.profilText(this.textForm.value).then((res: any) => {
      console.log(res.text.profileText);
      this.profileTextValue = res.text.profileText;
      this.editText = !this.editText;
    });
  }
  profilPhotoUpload(event: any) {
    const profilPhotoInput: any = document.getElementById('profilPhotoInput');

    this.imageService.profilPhotoService(
      profilPhotoInput.files[0],
      this.userUid
    );
  }
  dialogPost(item: any) {
    const postImage: any = document.getElementById('dialog-post');
    const postPhoto: any = document.getElementById('dialog-photo');
    document.getElementById('dialog-user-name')!.innerHTML = this.userNameRoute;
    document.getElementById('dialog-text')!.innerHTML = item.text;
    document.getElementById('post-date')!.innerHTML = item.datePost;
    postImage.setAttribute('src', item.url);
    postPhoto.setAttribute('src', this.userPhoto);
  }
  follow() {
    const follow = {
      username: this.profileUser.username,
      name: this.profileUser.name,
    };
    const followers = {
      username: this.myUserName,
      name: this.myName,
    };
    this.dbService.dbFollow(follow, followers, this.userUid).then((res) => {
      this.isFollowing = true;
    });
  }
  unFollow() {
    this.dbService
      .dbUnfollow(this.profileUser.username, this.userUid, this.myUserName)
      .then((res) => {
        this.isFollowing = false;
      });
  }
  following(){

    this.modalService.followingModal(this.followingList).then((res)=>{
      console.log(res);
      this.followingListModal=res
    })
  }
  followers(){
    this.modalService.followingModal(this.followersList).then((res)=>{
      this.followersListModal=res
    })
  }

  // followingModal(following:any) {
  //   const followingList=following
  //   const response:any =[]
  //   const followingListKeys=Object.keys(followingList)
  //   const promise = new Promise<any>((resolve,reject)=>{


  //   this.dbService.userNamesControl().then((res:userNameList)=>{
  //     const userNameList =res
  //     followingListKeys.forEach((element,index)=>{
  //       if(Object.hasOwn(userNameList,element)){
  //         const obj = {
  //           uid: userNameList[element as keyof userNameList]
  //         }
  //         response.push(Object.assign(followingList[element as keyof userNameList],obj));
  //     }
  //     })
  //     return response
  //   }).then((res)=>{

  //     const followingList:Array<any>=res
  //     const array:Array<any>=[]
  //     console.log(followingList);

  //     this.imageService.getProfilePhotolist().then((res:Array<any>)=>{
  //       const profilePhotoList=res
  //       console.log(profilePhotoList);

  //       followingList.forEach(posts =>{


  //         profilePhotoList.forEach(photos =>{

  //           if(posts.uid==photos.uid){
  //             array.push(Object.assign(posts, photos))
  //         }
  //         })

  //       })
  //       resolve (array)
  //     })
  //   })

  //   })
  //   return promise
  // }
}

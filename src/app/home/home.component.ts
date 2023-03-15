import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { getDatabase, onValue, ref } from 'firebase/database';
import { userPosts } from '../classes/user-posts';
import { AuthService } from '../Service/auth.service';
import { DbService } from '../Service/db-service.service';
import { ImageService } from '../Service/image.service';
import { ModalService } from '../Service/modal.service';
declare var bootstrap: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  isFollowing: boolean = false;
  userListArray: any = [];
  selecetedFile:any = null;
  postForm = new FormGroup({
    postText: new FormControl(''),
  });
  user = JSON.parse(localStorage.getItem('user') || '');
  myUserName: any;
  myName: any;
  deneme: any;
  userDb = this.dbService.getUserData(this.user.uid);
  isFollow!: boolean;
  userProfilePhoto: unknown;
  profilePhoto: any;
  searchArray: any = [];
  searchForm = new FormGroup({
    searchText: new FormControl(''),
  });
  db=getDatabase()
  followingList: any;
  myFollowingList:Array<any>=[]

  constructor(
    private authService: AuthService,
    private router: Router,
    private dbService: DbService,
    private imageService: ImageService,
    private postClass: userPosts,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    console.log(this.user.uid);

    this.profilePhoto = this.imageService
      .getProfilePhoto(this.user.uid)
      .then((res) => {
        this.userProfilePhoto = res;
        console.log('profile Photo', this.userProfilePhoto);
        return this.userProfilePhoto;
      });
    this.imageService.getProfilePhotolist().then((res) => {
      console.log(res);
    });
    this.dbService.getUserData(this.user.uid).then((res) => {
      this.myUserName = res.username;
      this.myName = res.name;
      console.log(res);
      this.followingList = res.following;
      console.log(res.following);
    });
    const referance = ref(this.db, `users/`+this.user.uid+'/follow/following');
      onValue(referance, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      this.myFollowingList = [];
      if (data) {
        this.myFollowingList.push(Object.keys(data));
        console.log(this.myFollowingList[0]);
      }


    });
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
    console.log(event);
    const { v4: uuidv4 } = require('uuid');
        const postUid = uuidv4();
    const obj  = event.target.files[0];
    this.selecetedFile = new File([obj], postUid, {type: obj.type});
    // this.selecetedFile = event.target.files[0];

    console.log(this.selecetedFile);


    const inputImage: any = document.getElementById('image');
    const chosenImage: any = document.getElementById('chosen-image');
    let reader = new FileReader();
    reader.readAsDataURL(inputImage.files[0]);
    console.log(inputImage.files[0]);
    reader.onload = () => {
      chosenImage.setAttribute('src', reader.result);
      console.log(reader.result);
    };
  }
  imageUpload() {
    this.imageService
      .postService(this.selecetedFile, this.user.uid)
      .then((res) => {
        console.log(res);
        let date: Date = new Date();
        let dateUTC = date.toUTCString()
        const { v4: uuidv4 } = require('uuid');
        const postUid = uuidv4();
        const postClass: userPosts = {
          text: this.postForm.value.postText,
          date: dateUTC,
          url: res,
          username: this.user.username,
          uid: this.user.uid,
          postUid: postUid,
          likes: {},
          postName:this.selecetedFile.name
        };
        this.dbService.userPostDb(postClass, this.myUserName);
      }).then((res)=>{
        location.reload();
      })
  }
  searchModal(event: any) {
    console.log();
    const createPost = new bootstrap.Modal(
      document.getElementById('searchModal')
    );

    if (event.isTrusted) {
      createPost.show();
    } else {
      createPost.hide();
    }
  }
  searching() {
    let userList: any = [];
    console.log(this.searchForm.value.searchText);
    const text = this.searchForm.value.searchText;
    this.dbService.getsearchingUser(text).then((res) => {
      userList = res;
      console.log(userList);

      this.modalService.modalDeneme(userList).then((res) => {
        console.log(res);
        const array: Array<any> = res;
        this.searchArray = array.slice();
      });
    });
  }
  checkFollow(username: any) {
    if (this.followingList) {
      if (Object.hasOwn(this.followingList, username)) {
        this.isFollowing = true;
      } else {
        this.isFollowing = false;
      }
    } else {
      this.isFollowing = false;
    }
    return this.isFollowing;
  }
  clickDeneme() {
    this.searchArray = [];
  }
  follow(item: any) {
    console.log(
      'USERNAME: ',
      item.username,
      ' NAME: ',
      item.name,
      ' UID: ',
      item.uid
    );
    const itemUid = item.uid;
    const follow = {
      uName: item.username,
      name: item.name,
    };
    const followers = {
      uName: this.myUserName,
      name: this.myName,
    };
    console.log(item);
    console.log(follow, ' UİD: ', itemUid);

    this.dbService.dbFollow(follow, followers, itemUid).then((res) => {
      this.isFollowing = true;
    });
  }
  unFollow(item: any) {
    console.log('unfollow işlemi yapılıyor');

    this.dbService
      .dbUnfollow(item.username, item.uid, this.myUserName)
      .then((res) => {
        this.isFollowing = false;
      });
  }
  followControl(item:any){
    console.log(item);

    this.isFollowing =this.myFollowingList[0].includes(item.username)
    return this.isFollowing;
  }
  searchControl(item:any){
    return this.myUserName!=item.username ? true : false
  }
}

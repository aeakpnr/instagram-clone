import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { getDatabase, onValue, ref } from 'firebase/database';
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
  postDeleteArray:any
  myFollowingList:any
  profilePhotoList: Array<any> = [];
  followingListModal!: Array<any>;
  followersListModal: any;
  followingList: any;
  followersList: any;
  profileUser: any;
  profileUid!: boolean;
  isFollowing!: boolean;
  profilePosts: any;
  profilePostNumber:number=0
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
  db=getDatabase()
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
        const referance = ref(this.db, `users/`+this.userUid+'/follow');
          onValue(referance, (snapshot) => {
            const data = snapshot.val();
            console.log(data);
            this.followingList = [];
            if(data){
              if(data.following){
                this.followingList = data.following;
              console.log('///////////', data.following);

              console.log(this.followingList);

              this.followingCount = Object.keys(data.following).length;
              }
              else{
                this.followingCount = 0;
              }
      }
      if (data) {
        if(data.followers){
          this.followersList = data.followers;
          console.log(this.followersList);

          this.followersCount = Object.keys(this.followersList).length;
        }
        else{
          this.followersCount = 0;
        }
      }
      else {
        this.followersCount = 0;
      }


    });
        this.dbService.getUserData(this.userUid).then((res) => {

          // if (res.follow) {
          //   if(res.follow.following){
          //     this.followingList = res.follow.following;
          //   console.log('///////////', res.follow.following);

          //   console.log(this.followingList);

          //   this.followingCount = Object.keys(res.follow.following).length;
          //   }
          //   else{
          //     this.followingCount = 0;
          //   }
          // } else {
          //   this.followingCount = 0;
          // }
          // if (res.follow) {
          //   if(res.follow.followers){
          //     this.followersList = res.follow.followers;
          //     console.log(this.followersList);

          //     this.followersCount = Object.keys(this.followersList).length;
          //   }
          //   else{
          //     this.followersCount = 0;
          //   }
          // }
          // else {
          //   this.followersCount = 0;
          // }

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
            if (this.myUserName != this.userNameRoute) {
              if (Object.hasOwn(this.followersList, this.myUserName)) {
                this.isFollowing = true;
              } else {
                this.isFollowing = false;
              }
            }
          });

          this.dbService.getPosts(res.username).then((post:object) => {
            console.log('////////////', post);
            console.log(post);

            if (post) {
              this.profilePosts =Object.values(post) ;
              this.profilePostNumber=this.profilePosts.length
            } else {
              this.profilePosts = false;
              this.noPost = true;
            }
            console.log();

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
    this.postDeleteArray=item
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
      uName: this.profileUser.username,
      name: this.profileUser.name,
    };
    const followers = {
      uName: this.myUserName,
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
  following() {
    console.log(this.followingList);
    this.followersListModal=[]
    this.modalService.followingModal(this.followingList).then((res) => {
      console.log(res);
      this.followersListModal = res;
    });
  }
  followers() {
    this.followersListModal=[]
    this.modalService.followingModal(this.followersList).then((res) => {
      this.followersListModal = res;
    });
  }

  likeControl(item:any){

    return this.myUserName!=item.uName ? true : false
  }
  followControl(item:any){
    this.isFollowing =this.myFollowingList[0].includes(item.uName)
    return this.isFollowing;
  }
  modalFollow(item:any){
    console.log(item);

    const follow = {
      uName: item.uName,
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
  modalUnFollow(item:any){
    this.dbService
    .dbUnfollow(item.uName, item.uid, this.myUserName)
    .then((res) => {
      this.isFollowing=false
    });
  }
  deletePost(post:any){
    this.imageService.postDelete(post).then((res)=>{
      this.dbService.postDelete(post).then((res)=>{
        location.reload();
      })
    })

  }
}

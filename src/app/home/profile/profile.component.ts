import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { object } from 'rxfire/database';
import { DbService } from 'src/app/Service/db-service.service';
import { ImageService } from 'src/app/Service/image.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  // user = JSON.parse(localStorage.getItem('user') || '')
  followingArray:Array<any>=[]
  profileUser:any
  profileUid!:boolean
  isFollowing!:boolean;
  profilePosts: any;
  selecetedFile = null;
  user = JSON.parse(localStorage.getItem('user') || '');
  userNameRoute:any = this.router.snapshot.paramMap.get('username');
  userData: any;
  userUid!: string;
  editText: boolean = false;
  profileTextValue!: any;
  imageArray: Array<any> = [];
  userPhoto: any;
  myUserName: any;
  myName:any;
  noPost:boolean=false
  followingCount!:number
  followersCount!:number
  constructor(
    private router: ActivatedRoute,
    private dbService: DbService,
    private imageService: ImageService
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
          if(this.user.uid==this.userUid){
            this.profileUid=true
          }
          else{
            this.profileUid=false
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

            this.followingCount=res.following !=null || res.following  !=undefined ? Object.keys(res.following).length : 0;


            this.followersCount=res.followers || res.followers !=undefined ? Object.keys(res.followers).length : 0;
            console.log(this.followingCount);

          console.log('PROFİL SAHİBİ VERİLERİ: ', res);
          console.log('KULLANICI SAHİBİ UİD: ',this.user.uid);


          this.dbService.getUserData(this.user.uid).then((res) =>{
            this.myUserName=res.username
            this.myName=res.name


        //  if(res.following){
        //     this.followingArray.push(Object.keys(res.following));
        //     this.followingCount=this.followingArray[0].length

        //     if(this.followingArray[0].includes(this.userNameRoute)){
        //     this.isFollowing=true
        //   }
        //   else{
        //     this.isFollowing=false
        //   }
        //   }
        //   else{
        //     this.isFollowing=false
        //     this.followingCount=0
        //   }

        })


          this.dbService.getPosts(res.username).then((res)=>{
            console.log('////////////',res);


            if(res){
              this.profilePosts = res;
            }
            else{
              this.profilePosts=false
              this.noPost=true
            }

          })

          const array: Array<any> = [];
          array.push(res);
          this.profileUser=res

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
  follow(){
    const follow = {
      username:this.profileUser.username,
      name:this.profileUser.name,
    }
    const followers={
      username:this.myUserName,
      name:this.myName,
    }
    this.dbService.dbFollow(follow,followers,this.userUid).then((res)=>{
      this.isFollowing=true
    })
  }
  unFollow(){
    this.dbService.dbUnfollow(this.profileUser.username,this.userUid,this.myUserName).then((res)=>{
      this.isFollowing=false
    })
  }

}

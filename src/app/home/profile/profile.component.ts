import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  userNameRoute = this.router.snapshot.paramMap.get('username');
  userData: any;
  userUid!: string;
  editText: boolean = false;
  profileTextValue!: any;
  imageArray: Array<any> = [];
  userPhoto: any;
  userName: any;
  noPost:boolean=false
  followingCount!:number
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
          profilPhoto.setAttribute('src', res);
        });
        this.imageArray = this.imageService.getPosts(this.userUid);




        return this.userUid;
      })
      .then((res) => {


        this.dbService.getUserData(this.userUid).then((res) => {

          console.log('PROFİL SAHİBİ UİD: ',this.userUid);
          console.log('KULLANICI SAHİBİ UİD: ',this.user.uid);

          const username= res.username
          this.dbService.getUserData(this.user.uid).then((res) =>{

         if(res.following){
            this.followingArray.push(Object.keys(res.following));
            this.followingCount=this.followingArray[0].length

            if(this.followingArray[0].includes(username)){
            this.isFollowing=true
          }
          else{
            this.isFollowing=false
          }
          }
          else{
            this.isFollowing=false
            this.followingCount=0
          }

        })


          this.dbService.getPosts(res.username).then((res)=>{

            if(res){
              this.profilePosts = Object.values(res);
            }
            else{
              this.profilePosts=false
              this.noPost=true
            }

          })

          const array: Array<any> = [];
          array.push(res);
          this.userName = res.username;

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
    document.getElementById('dialog-user-name')!.innerHTML = this.userName;
    document.getElementById('dialog-text')!.innerHTML = item.text;
    document.getElementById('post-date')!.innerHTML = item.datePost;
    postImage.setAttribute('src', item.url);
    postPhoto.setAttribute('src', this.userPhoto);
  }
  follow(){
    const follow = {
      username:this.profileUser.username,
      name:this.profileUser.name,
      posts:this.profilePosts,
    }
    this.dbService.dbFollow(follow).then((res)=>{
      this.isFollowing=true
    })
  }
  unFollow(){
    this.dbService.dbUnfollow(this.profileUser.username).then((res)=>{
      this.isFollowing=false
    })
  }

}

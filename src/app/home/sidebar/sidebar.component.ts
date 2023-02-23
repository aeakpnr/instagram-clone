import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/Service/db-service.service';
import { ImageService } from 'src/app/Service/image.service';
import { AuthService } from '../../Service/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() dbRes :any
  @Output() newCreateButton = new EventEmitter<boolean>()
  userUid = JSON.parse(localStorage.getItem('user') || '').uid
  userName:any
  constructor(private authService: AuthService, private router:Router, private dbService: DbService, private imageService: ImageService) { }

  createButton: boolean=false
  ngOnInit(): void {

    this.imageService.getProfilePhoto(this.userUid).then((res)=>{
      const profilePhoto:any = document.getElementById('sidebar-photo')
      profilePhoto.setAttribute("src", res)
    })
    this.dbRes.then((res:any)=>{
      console.log(res);
      this.userName= res.username
      document.getElementById('user-profile-name')!.innerHTML = res.name
      console.log(this.dbRes);

    })


  }
  create(event:any){
    console.log(event);

    this.createButton=!this.createButton
    this.newCreateButton.emit(event)
  }
singout(){
  this.authService.signoutService().then(()=>{
    this.router.navigate(['login']);
  })
}
profileRoute(userName:any){

  this.router.navigate(['profile/', userName]).then((res)=>window.location.reload())

}

}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/Service/db-service.service';
import { ImageService } from 'src/app/Service/image.service';
import { AuthService } from '../../Service/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @Input() dbRes: any;
  @Input() userProfilePhoto: any;
  @Output() newCreateButton = new EventEmitter<boolean>();
  @Output() search = new EventEmitter<boolean>();
  userUid = JSON.parse(localStorage.getItem('user') || '').uid;
  userName: any;
  createButton: boolean = false;
  searchButton: boolean = false;
  clickEventId!:string

  constructor(
    private authService: AuthService,
    private router: Router,
    private dbService: DbService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.userProfilePhoto.then((res: any) => {
      console.log('profile PHOTO RES SIDEBAR ', res);
      const profilePhoto: any = document.getElementById('sidebar-photo');
      profilePhoto.setAttribute('src', res);
    });

    this.dbRes.then((res: any) => {
      console.log(res);
      this.userName = res.username;
      document.getElementById('user-profile-name')!.innerHTML = res.name;
      console.log(this.dbRes);
    });
  }
  create(event: any) {
    console.log(event);

    this.createButton = !this.createButton;
    this.newCreateButton.emit(event);
  }
  singout() {
    this.authService.signoutService().then(() => {
      this.router.navigate(['login']);
    });
  }
  profileRoute(userName: any) {
    this.router
      .navigate(['profile/', userName])

  }
  searchModal(event: any) {
    this.search.emit(event);
  }
  clickControl(event:any){
    console.log(event.target.id);
    this.clickEventId= event.target.id
  }
  date(){
    let d = new Date();
    const dateUTC = d.toUTCString()
    console.log(dateUTC);

}
}

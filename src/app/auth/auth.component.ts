import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Database, getDatabase, ref, set } from '@angular/fire/database';
import { AuthService } from '../Service/auth.service';
import { DbService } from '../Service/db-service.service';
import { UserSingup } from '../classes/user-singup';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private dbService: DbService,
    public userSignupClass: UserSingup
  ) {}
  signupForm = new FormGroup({
    name: new FormControl(''),
    userName: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });
  signinForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  ngOnInit(): void {

  }
  signinSubmit() {
    this.authService
      .signinEmailService(
        this.signinForm.value.email!,
        this.signinForm.value.password!
      )
      .then(() => {});
  }
  singupSubmit() {
    const singupClass : UserSingup = {
      name: this.signupForm.value.name,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
      userName: this.signupForm.value.userName
    }
    const value = this.dbService.userNamesControl(singupClass.userName!)
    value.then((res)=> {
      console.log(res);

    })
    // if(){

    // }
    // console.log('Kayıt Değerleri: ',singupClass);
    console.log(this.signupForm.value);
    // this.authService
    //   .signupEmailService(
    //     this.signupForm.value.email!,
    //     this.signupForm.value.password!
    //   )
    //   .then((res: any) => {
    //     this.dbService.userSignupDb(
    //       singupClass.name!,
    //       singupClass.userName!,
    //       singupClass.email!,
    //       singupClass.password!,
    //     );
    //   });
  }
}

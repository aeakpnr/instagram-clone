import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Database, getDatabase, object, ref, set } from '@angular/fire/database';
import { AuthService } from '../Service/auth.service';
import { DbService } from '../Service/db-service.service';
import { UserSingup } from '../classes/user-singup';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  userNameUsing:boolean=false
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
    const value = this.dbService.userNamesControl()
    value.then((res:object)=> {
      console.log(res);
      console.log(singupClass.userName);
      const result: any = Object.hasOwn(res,(singupClass.userName!))
      console.log(result);


      if(result==true || null){
        this.userNameUsing=true
        const newUser = new Object (singupClass.userName)
        console.log(1235);

      }
      else{
        this.userNameUsing=false

        this.authService
        .signupEmailService(
          this.signupForm.value.email!,
          this.signupForm.value.password!
        )
        .then((res: any) => {
          console.log(res);
          const userUid= res
          this.dbService.userSignupDb(
            singupClass.name!,
            singupClass.userName!,
            singupClass.email!,
            singupClass.password!,
            userUid
            );
        }).then(()=>{
          this.router.navigate([''])
        });
    }
    })

    console.log(this.signupForm.value);

  }
}

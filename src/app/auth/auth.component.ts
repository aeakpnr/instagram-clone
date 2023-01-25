import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Database, getDatabase, ref, set } from '@angular/fire/database';
import { AuthService } from '../Service/auth.service';
import { DbService } from '../Service/db-service.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private dbService: DbService
  ) {}
  singupForm = new FormGroup({
    name: new FormControl(''),
    userName: new FormControl(''),
    email: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
  });
  singinForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  ngOnInit(): void {}
  singinSubmit() {
    this.authService
      .singinEmailService(
        this.singinForm.value.email!,
        this.singinForm.value.password!
      )
      .then(() => {});
  }
  singupSubmit() {
    console.log(this.singupForm.value);
    this.authService
      .singupEmailService(
        this.singupForm.value.email!,
        this.singupForm.value.password!
      )
      .then((res: any) => {
        this.dbService.userSignupDb(
          this.singupForm.value.name!,
          this.singupForm.value.userName!,
          this.singupForm.value.email!,
          this.singupForm.value.password!
        );
      });
  }
}

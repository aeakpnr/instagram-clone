import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../Service/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}
  singupForm = new FormGroup({
    name: new FormControl(''),
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


  }
  singupSubmit() {
    console.log(this.singupForm.value);
    this.authService.singupEmailService(
      this.singupForm.value.email!,
      this.singupForm.value.password!
    );

  }

}

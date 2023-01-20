import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { environment } from 'src/environments/environment.prod';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private firebaseAuth: AngularFireAuth, private router : Router) {}

  async singupEmailService(email: string, password: string) {
    return await this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        localStorage.setItem('user', JSON.stringify(res.user))
        this.router.navigate(['home']);
      });
  }
  async singupGmailService() {
    return await this.firebaseAuth
      .signInWithPopup(new GoogleAuthProvider())
      .then((res) => localStorage.setItem('user', JSON.stringify(res.user)));
  }
  async singinEmailService(email: string, password: string) {
    return await this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        localStorage.setItem('user', JSON.stringify(res.user))
        this.router.navigate(['home'])
      });
  }
  async singinGmailService() {
    return await this.firebaseAuth
      .signInWithPopup(new GoogleAuthProvider())
      .then((res) => localStorage.setItem('user', JSON.stringify(res.user)));
  }
  async singoutService(){
    return await this.firebaseAuth.signOut().then((res)=> {
      localStorage.clear()
      this.router.navigate([''])
    })
  }
}

import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { environment } from 'src/environments/environment.prod';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private firebaseAuth: AngularFireAuth, private router : Router, private database: AngularFireDatabase) {}

  async singupEmailService(email: string, password: string) {
    return await this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {

        localStorage.setItem('user', JSON.stringify(res.user))
        this.router.navigate(['']);
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
        this.router.navigate([''])
      });
  }
  async singinGmailService() {
    return await this.firebaseAuth
      .signInWithPopup(new GoogleAuthProvider())
      .then((res) => localStorage.setItem('user', JSON.stringify(res.user)));
  }
  async singoutService(){
    return await this.firebaseAuth.signOut().then((res)=> {
      localStorage.clear();

    })
  }
  deneme(){
    // this.database.list()
  }
}

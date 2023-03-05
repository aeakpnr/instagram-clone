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
  constructor(
    private firebaseAuth: AngularFireAuth,
    private router: Router,
    private database: AngularFireDatabase
  ) {}

  signupEmailService(email: string, password: string) {
    const signupPromise = new Promise((resolve, reject) => {
      this.firebaseAuth
        .createUserWithEmailAndPassword(email, password)
        .then((res) => {
          console.log('Kayıt Verileri: ', res);

          localStorage.setItem('user', JSON.stringify(res.user));
          resolve(res.user?.uid);
        });
    });
    return signupPromise;
  }

  async signupGmailService() {
    return await this.firebaseAuth
      .signInWithPopup(new GoogleAuthProvider())
      .then((res) => localStorage.setItem('user', JSON.stringify(res.user)));
  }
  async signinEmailService(email: string, password: string) {
    return await this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        localStorage.setItem('user', JSON.stringify(res.user));
        this.router.navigate(['']);
      });
  }
  async signinGmailService() {
    return await this.firebaseAuth
      .signInWithPopup(new GoogleAuthProvider())
      .then((res) => localStorage.setItem('user', JSON.stringify(res.user)));
  }
  async signoutService() {
    return await this.firebaseAuth.signOut().then((res) => {
      localStorage.clear();
    });
  }

}

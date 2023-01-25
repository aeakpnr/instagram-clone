import { Injectable } from '@angular/core';
import { user } from '@angular/fire/auth';
import { Database, getDatabase, ref, set } from '@angular/fire/database';


@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private database: Database) { }
  userSignupDb(name:string, userName:string, email:string, password:string){
    const user = JSON.parse(localStorage.getItem('user') || '')
      console.log(user.uid);
    const db = getDatabase();
  set(ref(db, 'users/' + user.uid), {
    name: name,
    username: userName,
    email:email,
    password: password,

  });
  }
}

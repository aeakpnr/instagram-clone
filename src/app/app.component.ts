import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { initializeApp } from '@angular/fire/app';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { child, push } from '@firebase/database';

import { environment } from 'src/environments/environment.prod';
import { Database,getDatabase, ref, set  } from '@angular/fire/database';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private http:HttpClient, public database: Database){

  }
  title = 'instagram-clone';
  // user = new FormGroup({
  //   name: new FormControl(''),
  //   password: new FormControl ('')
  // })

  onSubmit(){
  //   console.log(this.user.value);
  //   // this.http.post('https://instagram-clone-2b700-default-rtdb.firebaseio.com/users.json',this.user.value).subscribe((res)=>console.log(res.propertyIsEnumerable));
  //   // this.http.get('https://instagram-clone-2b700-default-rtdb.firebaseio.com/users.json').subscribe((res)=>console.log(res));


  //   const db = getDatabase();
  // set(ref(db, 'users/' + this.user.value.name), {
  //   username: this.user.value.name,
  //   password: this.user.value.password,

  // });

  }
}

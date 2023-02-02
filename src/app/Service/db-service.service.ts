import { Injectable } from '@angular/core';
import { user } from '@angular/fire/auth';
import { Database, getDatabase, onValue, ref, set } from '@angular/fire/database';


@Injectable({
  providedIn: 'root'
})
export class DbService {
 db = getDatabase();

  constructor(private database: Database) { }
  userSignupDb(name:string, userName:string, email:string, password:string){
    const user = JSON.parse(localStorage.getItem('user') || '')
      console.log(user.uid);

  set(ref(this.db, 'users/' + user.uid), {
    name: name,
    username: userName,
    email:email,
    password: password,

  });
  }
  userNamesControl(userName:string){
    const starCountRef = ref(this.db, 'UserNameList');
    let data :object
    let array: Array <string>
    const promise = new Promise((resolve,reject)=>{
      onValue(starCountRef, (snapshot) => {
    data = snapshot.val();
    array =Object.keys(data)
    console.log();

    const val = array.filter((list)=>{
      const deneme= userName.toString()
      console.log(deneme);

      list == '345'
    })
  console.log(val);
  resolve (array)
});
    })
    return promise


}
}

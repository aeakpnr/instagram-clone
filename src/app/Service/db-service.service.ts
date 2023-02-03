import { Injectable } from '@angular/core';
import { user } from '@angular/fire/auth';
import { Database, getDatabase, onValue, ref, set } from '@angular/fire/database';
import { update } from 'firebase/database';


@Injectable({
  providedIn: 'root'
})
export class DbService {
 db = getDatabase();

  constructor(private database: Database) { }
  userSignupDb(name:string, userName:string, email:string, password:string, userList:object){
    const user = JSON.parse(localStorage.getItem('user') || '')
      console.log(user.uid);

  set(ref(this.db, 'users/' + user.uid), {
    name: name,
    username: userName,
    email:email,
    password: password,

  });
  update(ref(this.db,'UserNameList/'), {
    [userName] : userList

  });

  }
  userNamesControl(userName:string){
    const starCountRef = ref(this.db, 'UserNameList');
    let data :object
    let array: Array <string>
    const promise = new Promise<object>((resolve,reject)=>{
      onValue(starCountRef, (snapshot) => {
    data = snapshot.val();



  resolve (data)
});
    })
    return promise


}
}

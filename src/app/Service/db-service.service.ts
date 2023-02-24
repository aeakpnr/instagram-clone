import { Injectable } from '@angular/core';
import { user } from '@angular/fire/auth';
import {
  child,
  Database,
  getDatabase,
  onValue,
  push,
  query,
  ref,
  set,
  orderByKey,
  orderByChild,
  get,
  remove,
  limitToLast,
  startAt,
} from '@angular/fire/database';
import {  equalTo, limitToFirst, orderByValue, update } from 'firebase/database';
import { userPosts } from '../classes/user-posts';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  db = getDatabase();

  constructor(private database: Database) {}
  userPostDb(
    postClass:userPosts,username:any
  ) {
    let data: object;
    const user = JSON.parse(localStorage.getItem('user') || '');
    console.log(user.uid);
    const dbase = ref(this.db, 'posts/'+username)





    update(ref(this.db, 'posts/'+postClass.date), {
      username:username,
      datePost:postClass.date,
      text:postClass.text,
      url:postClass.url,
      uid:postClass.uid
    });

  }
  userSignupDb(
    name: string,
    userName: string,
    email: string,
    password: string,
    userList: object
  ) {
    const user = JSON.parse(localStorage.getItem('user') || '');
    console.log(user.uid);

    set(ref(this.db, 'users/' + user.uid), {
      name: name,
      username: userName,
      email: email,
      password: password,
    });
    update(ref(this.db, 'UserNameList/'), {
      [userName]: userList,
    });
  }
  userNamesControl() {
    const refDb = ref(this.db,);
    let data: object;
    const promise = new Promise<object>((resolve, reject) => {
      get(child(refDb,'UserNameList')).then((res)=>{
        data=res.val()
        console.log('userNameList Deneme: ',data);
        resolve(data)
      })
    });
    return promise;
  }
  getUserUid() {
    const refDb = ref(this.db,);
    let data: object;
    const promise = new Promise<object>((resolve, reject) => {
      get(child(refDb,'UserNameList')).then((res)=>{
        data=res.val()
        console.log('userNameList Deneme: ',data);
        resolve(data)
      })
    });
    return promise;
  }
  getUserData(uid:string){
    console.log('user Uid: ',uid);

    const refDb = ref(this.db,`users/`);
    let data: object;
    const promise = new Promise<any>((resolve, reject) => {
      get(child(refDb,uid)).then((res)=>{
        console.log('getUserData Res Value: ',res.val());

        data = res.val()
        console.log('DB GET DENEME: ',data);
        resolve(data)
      })
    });
      return promise

  }
  profilText(text:any){
    const user = JSON.parse(localStorage.getItem('user') || '');
    const promise = new Promise<any>((resolve,reject)=>{
      update(ref(this.db, 'users/' + user.uid), {
      text: text
    }).then((res)=>{
      this.getUserData(user.uid).then((res)=>{
        console.log(res);
        resolve(res)
      })

    })

    })
    return promise

  }
  // sortingPosts(){
  //   let data: object;
  //   const user = JSON.parse(localStorage.getItem('user') || '');
  //   console.log(user.uid);
  //   const dbase = ref(this.db, 'users/'+user.uid)
  //   const promise = new Promise<object>((resolve, reject)=>{
  //     get(child(dbase,'/posts')).then((res)=>{
  //       data=res.val()
  //       console.log('post verileri çağırma: ',data);
  //       resolve(data)
  //     })
  //   })
  //   return promise
  // }
  dbFollow(following:any,followers:any,profileUid:any){
    const user = JSON.parse(localStorage.getItem('user') || '');
    console.log(user.uid);
    console.log(following);
    const followersRef =ref(this.db, 'users/'+profileUid+'/followers/'+followers.username)
    const followingRef = ref(this.db, 'users/'+user.uid+'/following/'+following.username)
    update(followersRef,followers).then((res)=>{

    })
    return update(followingRef,following).then((res)=>{
      console.log(res);
      return res
    })
  }
  dbUnfollow(username:any,followingUid:any,myUserName:any){
    const user = JSON.parse(localStorage.getItem('user') || '');
    console.log(user.uid);
    const followersRef = ref(this.db, 'users/'+followingUid+'/followers/'+myUserName)
    const followingRef = ref(this.db, 'users/'+user.uid+'/following/'+username)
    remove(followersRef).then((res)=>{
      console.log(res);

    })
    return remove(followingRef).then((res)=>{
      console.log(res);
      return res
    })
  }
  getPosts(username:any){
    const posts:any=[]
    const refDb = ref(this.db,);
    let data: object;
    const recentPostsRef = query(ref(this.db, 'posts'),orderByChild('username') ,equalTo(username));
    const promise = new Promise<object>((resolve, reject) => {
      get(recentPostsRef).then((res)=>{

        res.forEach(element =>{
          posts.push(element.val())
        })

      })
      resolve (posts)
    });
    return promise;
  }
  postsListining(followingList:Array<any>,username:string){
    console.log(followingList);

    followingList.push(username)
    const followingPosts:Array<any>=[]
    const promise = new Promise<Array<any>>((resolve, reject) =>{
      followingList.forEach((element,index)=>{
        const recentPostsRef = query(ref(this.db, 'posts'),orderByChild('username') ,equalTo(element));

          get(recentPostsRef).then((res)=>{
            res.forEach(element =>{
              followingPosts.push(element.val())
            })
            if(followingList.length==index+1){
              resolve (followingPosts)
            }
          })
      })
  })
  return promise
  }
}

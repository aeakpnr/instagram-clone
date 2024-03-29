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
  orderByPriority,
} from '@angular/fire/database';
import {
  endAt,
  endBefore,
  equalTo,
  limitToFirst,
  orderByValue,
  update,
} from 'firebase/database';
import { userNameList } from '../classes/user-name-list';
import { userPosts } from '../classes/user-posts';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  db = getDatabase();
  myData:any

  constructor(private database: Database) {}
  userPostDb(postClass: userPosts, username: any) {
    const user = JSON.parse(localStorage.getItem('user') || '');
    console.log(user.uid);

    update(ref(this.db, 'posts/' + postClass.postUid), {
      username: username,
      datePost: postClass.date,
      text: postClass.text,
      url: postClass.url,
      uid: postClass.uid,
      postUid: postClass.postUid,
      postName:postClass.postName,
      likes: {
        likeCount: 0,
      },
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
    const refDb = ref(this.db);
    let data: userNameList;
    const promise = new Promise<userNameList>((resolve, reject) => {
      get(child(refDb, 'UserNameList')).then((res) => {
        data = res.val();
        console.log('userNameList Deneme: ', data);
        resolve(data);
      });
    });
    return promise;
  }
  getUserUid() {
    const refDb = ref(this.db);
    let data: object;
    const promise = new Promise<object>((resolve, reject) => {
      get(child(refDb, 'UserNameList')).then((res) => {
        data = res.val();
        console.log('userNameList Deneme: ', data);
        resolve(data);
      });
    });
    return promise;
  }
  getUserData(uid: string) {
    console.log('user Uid: ', uid);

    const refDb = ref(this.db, `users/`+uid);
    let data: object;
    const promise = new Promise<any>((resolve, reject) => {
      onValue(refDb, (res) => {
        console.log('getUserData Res Value: ', res.val());

        data = res.val();
        console.log('DB GET DENEME: ', data);
        resolve(data);
      });
    });
    return promise;
  }
  profilText(text: any) {
    const user = JSON.parse(localStorage.getItem('user') || '');
    const promise = new Promise<any>((resolve, reject) => {
      update(ref(this.db, 'users/' + user.uid), {
        text: text,
      }).then((res) => {
        this.getUserData(user.uid).then((res) => {
          console.log(res);
          resolve(res);
        });
      });
    });
    return promise;
  }

  dbFollow(following: any, followers: any, profileUid: any) {
    const user = JSON.parse(localStorage.getItem('user') || '');
    console.log(user.uid);
    console.log(following);
    const followersRef = ref(
      this.db,
      'users/' + profileUid + '/follow/followers/' + followers.uName
    );
    const followingRef = ref(
      this.db,
      'users/' + user.uid + '/follow/following/' + following.uName
    );
    update(followersRef, followers).then((res) => {});
    return update(followingRef, following).then((res) => {
      console.log(res);
      return res;
    });
  }
  dbUnfollow(username: any, followingUid: any, myUserName: any) {
    const user = JSON.parse(localStorage.getItem('user') || '');
    console.log(user.uid);
    const followersRef = ref(
      this.db,
      'users/' + followingUid + '/follow/followers/' + myUserName
    );
    const followingRef = ref(
      this.db,
      'users/' + user.uid + '/follow/following/' + username
    );
    remove(followersRef).then((res) => {
      console.log(res);
    });
    return remove(followingRef).then((res) => {
      console.log(res);
      return res;
    });
  }
  getPosts(username: any) {
    const posts: any = [];
    const refDb = ref(this.db);
    let data: object;
    const recentPostsRef = query(
      ref(this.db, 'posts'),
      orderByChild('username'),
      equalTo(username)
    );
    const promise = new Promise<object>((resolve, reject) => {
      onValue(recentPostsRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        this.myData = Object.values(data)

        resolve(data);
      },{onlyOnce:true});

    });
    return promise;
  }
  postsListining(followingList: Array<any>, username: string) {
    console.log(followingList);

    followingList.push(username);
    const followingPosts: Array<any> = [];
    const promise = new Promise<Array<any>>((resolve, reject) => {
      followingList.forEach((element, index) => {
        const recentPostsRef = query(
          ref(this.db, 'posts'),
          orderByChild('username'),
          equalTo(element)
        );

        get(recentPostsRef).then((res) => {
          res.forEach((element) => {
            followingPosts.push(element.val());
          });
          if (followingList.length == index + 1) {
            resolve(followingPosts);
          }
        });
      });
    });
    return promise;
  }
  postLike(post: any, user: any) {
    console.log(user.uid);
    console.log(post.likes.likeCount);
    let count: any = 0;
    if (post.likes.likeCount == 0) {
      count = 1;
    } else {
      count = Object.keys(post.likes.likeUsers).length + 1;
    }

    update(ref(this.db, 'posts/' + post.postUid + '/likes/likeUsers'), {
      [user.username]: {
        username: user.username,
        name: user.name,
        uid: user.uid,
      },
    });
    return update(ref(this.db, 'posts/' + post.postUid + '/likes'), {
      likeCount: count++,
    });
  }
  postUnLike(post: any, userName: any) {
    console.log(post);

    let count = 0;
    if (post.likes.likeCount == 0) {
      count = 0;
    } else {
      count = Object.keys(post.likes.likeUsers).length - 1;
    }

    Object.keys(post.likes.likeUsers).length;
    console.log();

    update(ref(this.db, 'posts/' + post.postUid + '/likes'), {
      likeCount: count,
    });
    return remove(
      ref(this.db, 'posts/' + post.postUid + '/likes/likeUsers/' + userName)
    );
  }
  getOnePost(postUid: any) {
    const promise = new Promise<userPosts>((resolve, reject) => {
      get(ref(this.db, 'posts/' + postUid)).then((res) => {
        console.log(res.val());
        resolve(res.val());
      });
    });

    return promise;
  }
  getsearchingUser(text: any) {
    let val: any;
    const users: Array<any> = [];
    const recentPostsRef = query(
      ref(this.db, `users`),
      limitToFirst(5),
      orderByChild('username'),
      startAt(text)
    );
    const promise = new Promise((resolve, reject) => {
      get(recentPostsRef).then((res) => {
        res.forEach((element) => {
          val = {
            uid: element.key,
            username: element.val().username,
            name: element.val().name,
          };
          users.push(val);
        });
        console.log();

        resolve(users);
      });
    });
    return promise;
  }
  getMyData(uid:any){
    const referance = ref(this.db, `users/`+uid);
    onValue(referance, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      this.myData = data

      return this.myData
    });
  }
  postDelete(post:any){
    const referance = ref(this.db,`posts/${post.postUid}`)
    return remove(referance)
  }
}


import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getStorage,
  ref,
  uploadBytes,
  getMetadata,
  getDownloadURL,
  listAll,
  list,
} from 'firebase/storage';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  app = initializeApp(environment.firebase);
  storage = getStorage();
  user = JSON.parse(localStorage.getItem('user') || '');
  // Create a storage reference from our storage service

  constructor() {}

  profilPhotoService(file: any, user: any) {
    const profilPhotoRef = ref(this.storage, `ProfilePhotos/${user}`);
    this.imageUploadService(file, profilPhotoRef);
  }

  refService(user: any) {
    const userRef = ref(this.storage, `${user}/images`);
    return userRef;
  }
  postService(file: any, user: any) {
    const imagesRef = this.refService(user);

    const postRef = ref(imagesRef, `posts/${file.name}`);
    // const imageRef = ref(postRef, file.name)
    return this.imageUploadService(file, postRef).then((res) => {
      return getDownloadURL(postRef).then((url) => {
        console.log(url);

        return url;
      });
    });
  }
  getPosts(user: any) {
    const imageRef = this.refService(user);
    const postsRef = ref(imageRef, 'posts');

    const res = this.imageUrlList(postsRef);
    return res;
  }

  imageUploadService(file: any, ref: any) {
    // dosyayı, referans adresine yükler

    return uploadBytes(ref, file).then((snapshot) => {
      console.log(snapshot.metadata);
      return snapshot;
    });
  }
  getMetadata(user: any) {
    //referans adresindeki dosyayı url olarak getirir.
    const storageRef = ref(this.storage, user);
    return getDownloadURL(storageRef).then((url) => {
      console.log(url);

      return url;
    });
  }

  // async listStorage(ref:any){  //referans adresindeki dosyaları obje içerisinde aray olarak getirir.
  //   const firstPage = await list(ref, { maxResults: 100 });
  //   // console.log(firstPage);
  //   const deneme:Array<any>=[]

  //   for(let i =0;i<firstPage.items.length;i++){
  //     deneme.push(firstPage.items[i].toString())
  //     console.log(firstPage.items[i].toString());
  //   }
  //   console.log(deneme);
  //   return deneme

  // }
  imageUrlList(ref: any) {
    const imageArray: Array<any> = [];
    listAll(ref).then((res) => {
      console.log(res);

      res.items.forEach((item: any) => {
        getDownloadURL(item).then((url: any) => {
          imageArray.push(url);
        });
      });
      console.log(imageArray);
    });
    return imageArray;
  }
  getProfilePhoto(user: any) {
    const promise = new Promise((resolve, rejecet) => {
      const profilPhotoRef = ref(this.storage, `ProfilePhotos/${user}`);
      getDownloadURL(profilPhotoRef).then((res) => {
        console.log(res);
        resolve(res);
      });
    });
    return promise;
  }
  getProfilePhotolist() {
    const urlList: any = [];
    const promise = new Promise<Array<any>>((resolve, rejecet) => {
      const profilPhotoRef = ref(this.storage, `ProfilePhotos`);
      listAll(profilPhotoRef).then((res) => {
        res.items.forEach((itemRef: any, index) => {
          getDownloadURL(itemRef).then((url: any) => {
            urlList.push({ userPhoto: url, uid: itemRef.name });
            if (res.items.length == index + 1) {
              resolve(urlList);
            }
          });
        });
      });
    });
    return promise;
  }
}

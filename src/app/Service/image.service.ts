import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getMetadata, getDownloadURL ,listAll, list  } from "firebase/storage";
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  app = initializeApp(environment.firebase)
  storage = getStorage();

  // Create a storage reference from our storage service

  constructor() { }

  profilPhotoService(file:any,user:any){
    const imagesRef = this.refService(user)
    const profilPhotoRef = ref(imagesRef,'profil-photo')
     this.imageUploadService(file, profilPhotoRef)

  }

  refService(user:any){
    const userRef = ref(this.storage,`${user}/images`)
    return userRef
  }
  postService(file:any, user:any){
    const imagesRef= this.refService(user)

    const postRef = ref(imagesRef,`posts/${file.name}`)
    // const imageRef = ref(postRef, file.name)
    return this.imageUploadService(file, postRef).then(()=>{
      this.listStorage(imagesRef).then((res:any)=>{


      })
     })
  }
   getPosts(user:any){
    const imageRef = this.refService(user)
    const postsRef = ref(imageRef,'posts')
    return this.listStorage(postsRef)
  }

  imageUploadService(file:any ,ref:any){  // dosyayı, referans adresine yükler

    return uploadBytes(ref, file).then((snapshot) => {
      console.log(snapshot.metadata);
      return snapshot
    });
  }
  getMetadata(user:any){ //referans adresindeki dosyayı url olarak getirir.
    const storageRef = ref(this.storage,user);
    return getDownloadURL(storageRef)
  .then((url) => {
    console.log(url);

    return url

  })
  }
  async listStorage(ref:any){  //referans adresindeki dosyaları obje içerisinde aray olarak getirir.
    const firstPage = await list(ref, { maxResults: 100 });
    // console.log(firstPage);
    const deneme:Array<any>=[]
    for(let i =0;i<firstPage.items.length;i++){
      deneme.push(firstPage.items[i].bucket)
    }
    console.log(deneme);

    return deneme
  }


}

import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getMetadata, getDownloadURL   } from "firebase/storage";
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  app = initializeApp(environment.firebase)
  storage = getStorage();

  // Create a storage reference from our storage service

  constructor() { }
  imageUploadService(file:any,user:any){
    const storageRef = ref(this.storage,user);
    uploadBytes(storageRef, file).then((snapshot) => {
      console.log(snapshot.metadata);
    });
  }
  getMetadata(user:any){
    const storageRef = ref(this.storage,user);
    return getDownloadURL(storageRef)
  .then((url) => {
    console.log(url);

    return url

  })
  }
}

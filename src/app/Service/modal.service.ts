import { Injectable } from '@angular/core';
import { userNameList } from '../classes/user-name-list';
import { DbService } from './db-service.service';
import { ImageService } from './image.service';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private imageService:ImageService, private dbService:DbService) { }
  followingModal(following:any) {
    console.log(following);

    const followingList=following
    const response:any =[]
    const followingListKeys=Object.keys(followingList)


    const promise = new Promise<any>((resolve,reject)=>{


    this.dbService.userNamesControl().then((res:userNameList)=>{
      const userNameList =res
      followingListKeys.forEach((element,index)=>{
        if(Object.hasOwn(userNameList,element)){
          const obj = {
            uid: userNameList[element as keyof userNameList]
          }
          response.push(Object.assign(followingList[element as keyof userNameList],obj));
      }
      })
      return response
    }).then((res)=>{

      const followingList:Array<any>=res
      const array:Array<any>=[]
      console.log(followingList);

      this.imageService.getProfilePhotolist().then((res:Array<any>)=>{
        const profilePhotoList=res
        console.log(profilePhotoList);

        followingList.forEach(posts =>{


          profilePhotoList.forEach(photos =>{

            if(posts.uid==photos.uid){
              array.push(Object.assign(posts, photos))
          }
          })

        })
        resolve (array)
      })
    })

    })
    return promise
  }
}

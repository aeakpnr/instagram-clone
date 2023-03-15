import { Injectable } from "@angular/core"

@Injectable({
  providedIn: 'root'
})
export class userPosts {
  text!:string | null | undefined
  url!:string | null | undefined
  username!:string | null | undefined
  date!: string | null | undefined
  uid:any
  postUid:any
  likes:any
  postName:any
}


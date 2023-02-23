import { Injectable } from "@angular/core"

@Injectable({
  providedIn: 'root'
})
export class userPosts {
  text!:string | null | undefined
  url!:string | null | undefined
  username!:string | null | undefined
  date!: Date | null | undefined

}


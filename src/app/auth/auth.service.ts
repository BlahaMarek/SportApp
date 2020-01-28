import { Injectable } from '@angular/core';
import * as firebase from "firebase";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userId: string;
  constructor() {
    firebase.auth().onAuthStateChanged((user)=>{
      if (user){
        console.log(user.uid);
        this.userId = user.uid;
      }
      else {
        console.log("Nepodarilo sa nacitat uid usera")
      }
    });
  }

  get userIdAuth(): string {
    return this.userId;
  }
}

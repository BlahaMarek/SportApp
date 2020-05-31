import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {Activity} from "../models/activity";
import {BehaviorSubject, Observable} from "rxjs";
import {FirestoreService} from "./firestore.service";
import {DataService} from "../data/data.service";
import {map} from "rxjs/operators";
import {User} from "../models/user";
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersCollection: AngularFirestoreCollection<User>;
  private users: Observable<User[]>;
  constructor( private fireService: FirestoreService, private afs: AngularFirestore
      ,private dataService: DataService) {

    this.usersCollection = this.afs.collection<any>('users');

    this.users = this.usersCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data};
          });
        })
    );
  }


  getOneUser(id){

    return this.usersCollection.doc<User>(id).valueChanges();
  }
  updateUser(id, newUser){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('users').doc(id).set(newUser)
          .then(
              res => resolve(res),
              err => reject(err)
          )
    })
  }
  removeFriend(friend: User) {
    var loggedUser = this.dataService.userFromDatabase;
    // let userId = this.getOneUser(friend);
    for (var i = 0 ; i< loggedUser.friends.length ; i++){
      if (loggedUser.friends[i] == friend){
        loggedUser.friends.splice(i,1);
        break;
      }
      console.log("toto je activity bookedby[i]"+i);
    }
    return this.usersCollection.doc(loggedUser.id).update(loggedUser);

  }

}

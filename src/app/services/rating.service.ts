import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {User} from "../models/user";
import {Observable} from "rxjs";
import {FirestoreService} from "./firestore.service";
import {DataService} from "../data/data.service";
import {map} from "rxjs/operators";
import {Rating} from "../models/rating";
import {Activity} from "../models/activity";

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  private ratingCollection: AngularFirestoreCollection<User>;
  private ratings: Observable<User[]>;
  constructor( private fireService: FirestoreService, private afs: AngularFirestore
      ,private dataService: DataService) {

    this.ratingCollection = this.afs.collection<any>('ratings');

    // this.ratings = this.ratingCollection.snapshotChanges().pipe(
    //     map(actions => {
    //       return actions.map(a => {
    //         const data = a.payload.doc.data();
    //         const id = a.payload.doc.id;
    //         return {id, ...data};
    //       });
    //     })
    // );
  }
  getRatingsById(id, idKritika){ // vyberiem ratingy kde ich niekto uz ohodnotil ..prihlaseny dzad
    return this.afs.collection<Rating>('ratings', ref => ref.where('idAktivity','==',id)
        .where('isKritika','==',idKritika)).valueChanges();
  }

  getRatingsByUser(userId,sportId){ // vyberiem vsetky ratingy pouzivatela len zo sportu na ktory je prihlaseny
    return this.afs.collection<Rating>('ratings', ref => ref.where('idHraca','==',userId)
        .where('idSportu','==',sportId)).valueChanges();
  }

  getAllRatingsByUser(userId){ // vyberiem vsetky ratingy pouzivatela
    return this.afs.collection<Rating>('ratings', ref => ref.where('idHraca','==',userId)).valueChanges();
  }


  getOneRating(id){
    return this.ratingCollection.doc<Rating>(id).valueChanges();
  }
  updateRating(id, newUser){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('ratings').doc(id).set(newUser)
          .then(
              res => resolve(res),
              err => reject(err)
          )
    })
  }



}

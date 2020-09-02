import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {User} from "../models/user";
import {BehaviorSubject, Observable} from "rxjs";
import {FirestoreService} from "./firestore.service";
import {DataService} from "../data/data.service";
import {Rating} from "../models/rating";
import {Comment} from "../models/comment";
import {Activity} from "../models/activity";
import {map, take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private commentCollection: AngularFirestoreCollection<Comment>;
  private comments: Observable<Comment[]>;

  constructor(private fireService: FirestoreService, private afs: AngularFirestore
      , private dataService: DataService) {

    this.commentCollection = this.afs.collection<any>('comments');

  }


  readAllComments(aktivitiid) { //starsie mnou vytvorene
      var timestamp = new Date().getTime()
      return this.afs.collection('comments', ref => {
          let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;

          query = query.where("activitiId", "==", aktivitiid).orderBy('time','desc');
          return query;
      }).snapshotChanges().pipe(
          map(actions => {
              return actions.map(a => {
                  const data = a.payload.doc.data();
                  const id = a.payload.doc.id;
                  return {id, ...data};
              });
          })
      )
  }


  deleteComment(commentid) {
    return this.commentCollection.doc(commentid).delete();
  }
}

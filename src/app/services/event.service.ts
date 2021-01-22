import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {Activity} from "../models/activity";
import {BehaviorSubject, Observable} from "rxjs";
import {FirestoreService} from "./firestore.service";
import {map} from "rxjs/operators";
import * as firebase from "firebase";
import { DataService } from '../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private eventsCollection: AngularFirestoreCollection<Activity>;
  private events: Observable<Activity[]>;

  event: Activity;
  events2: any[] =[];routes;
  user: any = {};
  constructor(
      private fireService: FirestoreService,
      private afs: AngularFirestore,
      private dataService: DataService
  ) {

    this.eventsCollection = this.afs.collection<any>('events');
    // this.events = this.eventsCollection.snapshotChanges().pipe(
    //     map(actions => {
    //       return actions.map(a => {
    //         const data = a.payload.doc.data();
    //         const id = a.payload.doc.id;
    //         return {id, ...data};
    //       });
    //     })
    // );

    this.user = this.dataService.getSignInUser();

    this.fireService.readAllQueriesEvents().subscribe(res => {
      this.events2 = res;
      console.log("this is res")
      console.log(res)
      // this.dataService.setEvent(res);
      this.eventss = this.events2[0].concat(this.events2[1], this.events2[2]); // 3 queriny into 1 array..lebo firebase
      this.dataService.setEvent(this.eventss);

    })

    // fireService.readAllEvents().subscribe(all => {
    //   this.events2 = all;
    //
    //
    //   this.eventss =  this.events2;
    //   firebase.firestore().collection(`events`).get().then((query) => {
    //     this.events2 = query.docs;
    //   });
    // });

  }
  private _eventss = new BehaviorSubject<Activity[]>([]);
  readonly activities$ = this._eventss.asObservable();

  get eventss(): Activity[] {
    return this._eventss.getValue();
  }

  set eventss(activities: Activity[]) {
    this._eventss.next(activities);
  }

  get allEventsCount(): number {
    return this._eventss.getValue().length;
  }

  // add person, who booked activity to list of users, who booked
  addBookerToActivity(sport: Activity) {
    let activity: Activity = this.getEventById(sport.id);
    activity.bookedBy.push(this.user.id);
    return this.eventsCollection.doc(sport.id).update(activity);

  }

  // update activity
  updateActivity(sport: Activity, sportNew: Activity) { // toto treba dorobit
    let activity: Activity = this.getEventById(sport.id);
    activity = sportNew;

    return this.eventsCollection.doc(sport.id).update(activity);
  }

  removeBookerFromActivity(sport: Activity) {
    let activity: Activity = this.getEventById(sport.id);

    for (var i = 0 ; i< activity.bookedBy.length ; i++){
      if (activity.bookedBy[i] == this.user.id){
        activity.bookedBy.splice(i,1);
        break;
      }
    }
    return this.eventsCollection.doc(sport.id).update(activity);

  }

  // get activity by id
  getEventById(id: string): Activity {
    return this._eventss.getValue().find(activity => activity.id === id);
  }

  getEvent() {
    return this.events
  }
  getEvents(id){

    return this.eventsCollection.doc<Activity>(id).valueChanges();
  }

  getActivityCollection(id: string) {

  }

  addEvent(activity: Activity) {
    this.eventss = [
      ...this.eventss,
      activity
    ]
  }

  deleteEvent(sport: Activity) {
    return this.eventsCollection.doc(sport.id).delete();
  }
}

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
  private _eventss = new BehaviorSubject<Activity[]>([]);
  readonly activities$ = this._eventss.asObservable();
  event: Activity;
  events2: any[] =[];routes;
  user: any = {};
  constructor(
      private fireService: FirestoreService,
      private afs: AngularFirestore,
      private dataService: DataService
  ) {

    this.eventsCollection = this.afs.collection<any>('events');
    this.events = this.eventsCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data};
          });
        })
    );

    this.user = this.dataService.getSignInUser();
    fireService.readAllEvents().subscribe(all => {
      this.events2 = all;


      this.eventss =  this.events2;
      firebase.firestore().collection(`events`).get().then((query) => {
        this.events2 = query.docs;
      });
    });

    this.eventss = this.events2;
  }

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
    activity.bookedBy.push(this.user.user.uid);
    activity.bookedByNames.push(this.user.additionalUserInfo.profile.first_name);
    activity.peopleCount = activity.peopleCount +1;
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
      if (activity.bookedBy[i] == this.user.user.uid){
        activity.bookedBy.splice(i,1);
        activity.bookedByNames.splice(i,1);
        break;
      }
    }
    activity.peopleCount = activity.peopleCount -1;
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

import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {Activity} from "../models/activity";
import {BehaviorSubject, Observable} from "rxjs";
import {FirestoreService} from "./firestore.service";
import {AuthService} from "../auth/auth.service";
import {map} from "rxjs/operators";
import * as firebase from "firebase";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private eventsCollection: AngularFirestoreCollection<Activity>;
  private events: Observable<Activity[]>;
  event: Activity;
  events2: any[] =[];routes;

  constructor( private fireService: FirestoreService, private afs: AngularFirestore,private authService: AuthService) {


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


    fireService.readAllEvents().subscribe(all => {
      this.events2 = all;


      this.eventss =  this.events2;
      firebase.firestore().collection(`events`).get().then((query) => {
        this.events2 = query.docs;
      });
    });

    this.eventss = this.events2;


  }

  private _eventss = new BehaviorSubject<Activity[]>([]);
  readonly activities$ = this._eventss.asObservable();

  // get activity list
  get eventss(): Activity[] {
    return this._eventss.getValue();
  }

  // set activity list
  set eventss(activities: Activity[]) {
    this._eventss.next(activities);
  }

  // get count of activities
  get allEventsCount(): number {
    return this._eventss.getValue().length;
  }

  // add person, who booked activity to list of users, who booked
  addBookerToActivity(sport: Activity) {
    let activity: Activity = this.getEventById(sport.id);
    activity.bookedBy.push(this.authService.userIdAuth);
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
    console.log("toto je user id ]");
    console.log(this.authService.userIdAuth);

    for (var i = 0 ; i< activity.bookedBy.length ; i++){
      if (activity.bookedBy[i] == this.authService.userIdAuth){
        activity.bookedBy.splice(i,1);
        break;
      }
      console.log("toto je activity bookedby[i]"+i);
      console.log(activity.bookedBy[i]);
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


  // getActivities(): Observable<Activity>{
  //     return this.activities;
  // }

  getActivityCollection(id: string) {

  }


  // add new activity
  addEvent(activity: Activity) {
    this.eventss = [
      ...this.eventss,
      activity
    ]
  }



  // delete existing activity
  deleteEvent(sport: Activity) {
    return this.eventsCollection.doc(sport.id).delete();
    //this.activities = this.activities.filter(activity => activity.id !== id);


  }
}

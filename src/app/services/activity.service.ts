import {Injectable} from '@angular/core';
import {Activity} from '../models/activity';
import {BehaviorSubject, from} from 'rxjs';
import {FirestoreService} from './firestore.service';
import { Observable } from 'rxjs';
import {Sport} from "../models/sport";
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {map, take} from 'rxjs/operators';
import * as firebase from "firebase";
import {AuthService} from '../auth/auth.service';
import {forEach} from "@angular-devkit/schematics";




@Injectable({
    providedIn: 'root'
})
export class ActivityService {
    private sportsCollection: AngularFirestoreCollection<Activity>;
    private sports: Observable<Activity[]>;
    activity: Activity;
    sports2: any[] =[];routes;

    constructor( private fireService: FirestoreService, private afs: AngularFirestore,private authService: AuthService) {


        this.sportsCollection = this.afs.collection<any>('sports');
        this.sports = this.sportsCollection.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return {id, ...data};
                });
            })
        );


        fireService.readAllSports().subscribe(all => {
            this.sports2 = all;


            this.activities =  this.sports2;
                firebase.firestore().collection(`sports`).get().then((query) => {
                    this.sports2 = query.docs;
            });
        });

        this.activities = this.sports2;


    }
    // getFoodCollection(activityId: string) {
    //     this.sportsCollection = this.fireService.collection<Activity>(`activities/${activityId}`);
    //     this.sports = this.sportsCollection.snapshotChanges().pipe(
    //         map(actions => {
    //             return actions.map(a => {
    //                 const data = a.payload.doc.data();
    //                 const id = a.payload.doc.id;
    //                 return {id, ...data};
    //             });
    //         })
    //     );
    // }


    private _activities = new BehaviorSubject<Activity[]>([]);
    readonly activities$ = this._activities.asObservable();

    // get activity list
    get activities(): Activity[] {
        return this._activities.getValue();
    }

    // set activity list
    set activities(activities: Activity[]) {
        this._activities.next(activities);
    }

    // get count of activities
    get allActivitiesCount(): number {
        return this._activities.getValue().length;
    }

    // add person, who booked activity to list of users, who booked
    addBookerToActivity(sport: Activity) {
        let activity: Activity = this.getActivityById(sport.id);
        activity.bookedBy.push(this.authService.userIdAuth);
        activity.peopleCount = activity.peopleCount -1;
        return this.sportsCollection.doc(sport.id).update(activity);

    }

    // update activity
    updateActivity(sport: Activity, sportNew: Activity) { // toto treba dorobit
        let activity: Activity = this.getActivityById(sport.id);
        activity = sportNew;

        return this.sportsCollection.doc(sport.id).update(activity);
    }

    removeBookerFromActivity(sport: Activity) {
        let activity: Activity = this.getActivityById(sport.id);
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
        activity.peopleCount = activity.peopleCount +1;
        return this.sportsCollection.doc(sport.id).update(activity);

    }

    // get activity by id
    getActivityById(id: string): Activity {
        return this._activities.getValue().find(activity => activity.id === id);
    }

    getActivity() {
        return this.sports
    }
    getActivities(id){

        return this.sportsCollection.doc<Activity>(id).valueChanges();
    }


    // getActivities(): Observable<Activity>{
    //     return this.activities;
    // }

    getActivityCollection(id: string) {

    }


    // add new activity
    addActivity(activity: Activity) {
        this.activities = [
            ...this.activities,
            activity
        ]
    }



    // delete existing activity
    deleteActivity(sport: Activity) {
        return this.sportsCollection.doc(sport.id).delete();
        //this.activities = this.activities.filter(activity => activity.id !== id);


    }
}

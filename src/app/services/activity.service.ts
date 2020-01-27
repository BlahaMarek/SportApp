import {Injectable} from '@angular/core';
import {Activity} from '../models/activity';
import {BehaviorSubject, from} from 'rxjs';
import {FirestoreService} from './firestore.service';
import { Observable } from 'rxjs';
import {Sport} from "../models/sport";
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {map, take} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ActivityService {
    private sports: Observable<Activity[]>;
    private sportsCollection: AngularFirestoreCollection<Activity>;

    constructor( private fireService: FirestoreService ) {



        fireService.readAllSports().subscribe(all => {
            console.log("Toto je all")
            console.log(all);



            this.activities =  all;
        });


    }
    getFoodCollection() {
        this.sportsCollection = this.fireService.collection<Activity>(`activities`);
        this.sports = this.sportsCollection.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return {id, ...data};
                });
            })
        );
    }


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
    addBookerToActivity(id: string, userId: string) {
        let activity: Activity = this.getActivityById(id);
        activity.bookedBy.push(userId);
        this.activities = [
            ...this.activities.filter(activity=> activity.id !== id),
            activity
        ]
    }

    // get activity by id
    getActivityById(id: string): Activity {
        return this._activities.getValue().find(activity => activity.id === id);
    }

    // add new activity
    addActivity(activity: Activity) {
        this.activities = [
            ...this.activities,
            activity
        ]
    }

    // update activity
    updateActivity(id: string, activity: Activity) {
        this.activities = [
            ...this.activities.filter(activity=> activity.id !== id),
            activity
        ]
    }

    // delete existing activity
    deleteActivity(id: string) {
        this.activities = this.activities.filter(activity => activity.id !== id);
    }
}

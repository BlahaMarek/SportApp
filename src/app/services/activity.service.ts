import {Injectable} from '@angular/core';
import {Activity} from '../models/activity';
import {BehaviorSubject, from} from 'rxjs';
import {FirestoreService} from './firestore.service';
import { Observable } from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {map, take} from 'rxjs/operators';
import {AuthService} from '../auth/auth.service';
import {DataService} from "../data/data.service";



@Injectable({
    providedIn: 'root'
})
export class ActivityService {
    private sportsCollection: AngularFirestoreCollection<Activity>;
    private sports: Activity[];
    activity: Activity;
    sports2: any[] =[];routes;
    sports3: any[] =[];
    user: any = {};
    constructor( private fireService: FirestoreService, private afs: AngularFirestore,private authService: AuthService, private dataService: DataService) {


        this.sportsCollection = this.afs.collection<any>('sports');

        //  neviem na co to tu bolo
        // this.sports = this.sportsCollection.snapshotChanges().pipe(
        //     map(actions => {
        //         return actions.map(a => {
        //             const data = a.payload.doc.data();
        //             const id = a.payload.doc.id;
        //             return {id, ...data};
        //         });
        //     })
        // );

        this.user = this.dataService.getSignInUser();

        this.fireService.readAllQueries().subscribe(res => {
            console.log(res)
            this.sports2 = res;

            console.log("this is res")
            // this.activities = this.sports2[0].concat(this.sports2[1], this.sports2[2]); // 3 queriny into 1 array..lebo firebase
            this.sports = this.sports2[0].concat(this.sports2[1], this.sports2[2]);
            this.activities = this.sports;
            // this.dataService.setAktivity(this.activities);


        })



    }
    getNewActivity(){ // vyberiem vsetky ratingy pouzivatela
        var timestamp = new Date().getTime()
        return this.afs.collection<Activity>('sports', ref => ref.where("date", "<", timestamp)
            .where('bookedBy','array-contains',"1MUxrZRhP0Wsdad54w83Icw0y3k2")).valueChanges();
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
    addBookerToActivity(sport: Activity) {
        let activity: Activity = this.getActivityById(sport.id);
        activity.bookedBy.push(this.user.id);
        return this.sportsCollection.doc(sport.id).update(activity).then(result =>{
            console.log("podarilo se" + result)
        , err=>(err)

        });
    }

    // update activity
    updateActivity(sport: Activity, sportNew: Activity) { // toto treba dorobit
        let activity: Activity = this.getActivityById(sport.id);
        activity = sportNew;

        return this.sportsCollection.doc(sport.id).update(activity);
    }

    removeBookerFromActivity(sport: Activity) {
        let activity: Activity = this.getActivityById(sport.id);
        for (var i = 0 ; i< activity.bookedBy.length ; i++){
            if (activity.bookedBy[i] == this.user.id){
                activity.bookedBy.splice(i,1);
                break;
            }
            console.log("toto je activity bookedby[i]"+i);
            console.log(activity.bookedBy[i]);
        }
        return this.sportsCollection.doc(sport.id).update(activity);

    }

    // get activity by id
    getActivityById(id: string): Activity {
        return this._activities.getValue().find(activity => activity.id === id);
    }

    // getActivity(): Observable<Activity[]> {
    //     return this.sports
    // }
    getActivities(id){

        return this.sportsCollection.doc<Activity>(id).valueChanges();
    }

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
    }
}

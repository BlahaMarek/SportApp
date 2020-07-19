import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Activity} from '../models/activity';
import {map} from 'rxjs/operators';
import {User} from "../models/user";
import {Rating} from "../models/rating";
import {combineLatest, merge, Observable } from "rxjs";
import {DataService} from "../data/data.service";

@Injectable({
    providedIn: 'root'
})
export class FirestoreService {

    constructor(private firestore: AngularFirestore, private dataService: DataService) {
    }

    createSport(sport: Activity) {
        return this.firestore.collection('sports').add(sport);
    }

    createEvent(sport: Activity) {
        return this.firestore.collection('events').add(sport);
    }
    createRating(rating: Rating) {
        return this.firestore.collection('ratings').add(rating);
    }

    createUser(user: User) {
        return this.firestore.collection('users').doc(user.id).set(user);
    }

    readAllSports() { //len novsie
        var timestamp = new Date().getTime()
        return this.firestore.collection('sports', ref => {
            let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
            query = query.where('date', '>', timestamp); // na upravu stahujem len novsie sporty
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
    readAllSports2() { //starsie kde som bol booknuty
        var timestamp = new Date().getTime()
        return this.firestore.collection('sports', ref => {
            let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;

            query = query.where("date", "<", timestamp)
                .where('bookedBy','array-contains',this.dataService.getSignInUser().id);
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

    readAllSports3() { //starsie mnou vytvorene
        var timestamp = new Date().getTime()
        return this.firestore.collection('sports', ref => {
            let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;

            query = query.where("date", "<", timestamp)
                .where('createdBy','==', this.dataService.getSignInUser().id);
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

    readAllQueries():Observable<any>{ //kombinujem vseetky dokopy
        return combineLatest(this.readAllSports(), this.readAllSports2(), this.readAllSports3());
    }

    readAllEvents() {
        return this.firestore.collection('events').snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return {id, ...data};
                });
            })
        )
    }

    updateSport(sportId, sport) {
        this.firestore.doc('students/' + sportId).update(sport);
    }updateEvent(sportId, sport) {
        this.firestore.doc('students/' + sportId).update(sport);
    }

    deleteSport(sportId) {
        this.firestore.doc('Students/' + sportId).delete();
    }

    collection<T>(s: string) {
        return undefined;
    }
}

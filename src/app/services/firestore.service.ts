import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Activity} from '../models/activity';
import {map} from 'rxjs/operators';
import {User} from "../models/user";


@Injectable({
    providedIn: 'root'
})
export class FirestoreService {

    constructor(private firestore: AngularFirestore) {
    }

    createSport(sport: Activity) {
        return this.firestore.collection('sports').add(sport);
    }

    createEvent(sport: Activity) {
        return this.firestore.collection('events').add(sport);
    }
    createUser(user: User) {
        return this.firestore.collection('users').doc(user.id).set(user);
    }

    readAllSports() {
        return this.firestore.collection('sports').snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return {id, ...data};
                });
            })
        )
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

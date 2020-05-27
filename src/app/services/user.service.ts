import { User } from 'src/app/models/user';
import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Activity } from '../models/activity';
import { Observable, BehaviorSubject } from 'rxjs';
import { FirestoreService } from './firestore.service';
import {map, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersCollection: AngularFirestoreCollection<User>;
  private users: Observable<User[]>;
  event: Activity;
  user: any = {};


  constructor( private fireService: FirestoreService, private afs: AngularFirestore
    ,private dataService: DataService) {

      this.usersCollection = this.afs.collection<User>('users');


        this.users = this.usersCollection.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return {id, ...data};
                });
            })
        );

    }
    private _userss = new BehaviorSubject<User[]>([]);
    readonly activities$ = this._userss.asObservable();
    // get activity list
    get userss(): User[] {
      return this._userss.getValue();
  }

  // set activity list
  set userss(activities: User[]) {
      this._userss.next(activities);
  }

  // get count of activities
  get allUsersCount(): number {
      return this._userss.getValue().length;
  }


  // update activity
  addRating(id, newUser: User) { // toto treba dorobit
    let pouzivatel: User = newUser;
    return this.afs.collection('users').doc(id).set(pouzivatel);
  }

  getUserById(id: string) {
    return this.usersCollection.doc<User>(id).valueChanges();
  }

  updateTask(id, newUser){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('users').doc(id).set(newUser)
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }

}

import {Injectable} from '@angular/core';
import {Sport} from '../models/sport';
import {Activity} from "../models/activity";
import {AngularFireAuth} from "@angular/fire/auth";
import {BehaviorSubject} from "rxjs";
import {User} from "../models/user";


@Injectable({
    providedIn: 'root'
})
export class DataService {
    user: any = {};
    userFromDatabase: any = {};
    idZMapy: any = [];
    idEventZMapy: any = [];
    aktivity: Activity[];
    event: Activity[];
    constructor(private fireAuth: AngularFireAuth) {
    }
    private _user = new BehaviorSubject<any>([]);
    readonly user$ = this._user.asObservable();

    private _internet = new BehaviorSubject<boolean>(false);
    readonly internet$ = this._internet.asObservable();

    // get activity list
    get internet(): any {
        return this._internet;
    }

    // set activity list
    set internet(user: any) {
        this._internet.next(user);
    }

    // get activity list
    get userO(): any {
        return this._user.getValue();
    }

    // set activity list
    set userO(user: any) {
        this._user.next(user);
    }

    getSportsSk(): Sport[] {
        return [
            {
                label: 'Tenis',
                value: 1,
                tag: 1,
                icon: 'tennis',
            },
            {
                label: 'Squash',
                value: 2,
                tag: 1,
                icon: 'squash',
            },
            {
                label: 'Stolný tenis',
                value: 3,
                tag: 1,
                icon: 'ping-pong',
            },
            {
                label: 'Futbal',
                value: 4,
                tag: 1,
                icon: 'soccer',
            },
            {
                label: 'Florbal',
                value: 5,
                tag: 1,
                icon: 'floorball',
            },
            {
                label: 'Hokej',
                value: 6,
                tag: 1,
                icon: 'hockey',
            },
            {
                label: 'Volejbal',
                value: 7,
                tag: 1,
                icon: 'volejbal',
            },
            {
                label: 'Turistika',
                value: 23,
                tag: 1,
                icon: 'tennisball',
            },
            {
                label: 'Basketball',
                value: 8,
                tag: 1,
                icon: 'basketball',
            },
            {
                label: 'Fitness',
                value: 16,
                tag: 1,
                icon: 'tennisball',
            },
            {
                label: 'Americký fotbal',
                value: 10,
                tag: 1,
                icon: 'football',
            },

            {
                label: 'Baseball',
                value: 12,
                tag: 1,
                icon: 'baseball',
            },
            {
                label: 'Frisbee',
                value: 13,
                tag: 1,
                icon: 'frisbee',
            },
            {
                label: 'Hádzaná',
                value: 14,
                tag: 1,
                icon: 'tennisball',
            },

            {
                label: 'Bojové športy',
                value: 17,
                tag: 1,
                icon: 'fighting',
            },
            {
                label: 'Zimné športy',
                value: 18,
                tag: 1,
                icon: 'winter',
            },
            {
                label: 'Vodné športy',
                value: 22,
                tag: 1,
                icon: 'water',
            },
            {
                label: 'Cyklistika',
                value: 20,
                tag: 1,
                icon: 'cycling',
            },
            {
                label: 'Stolný futbal',
                value: 21,
                tag: 1,
                icon: 'kalceto',
            },

            {
                label: 'Motoristika',
                value: 24,
                tag: 1,
                icon: 'motoristic',
            },
        ];
    }

    getSportNameByValue(val: number): string {
        return this.getSportsSk().find(item => item.value == val).label;
    }

    getSportIconByValue(val: number): string {
        return this.getSportsSk().find(item => item.value == val).icon;
    }

    getAllActivities(actiities: Activity){
    }
    getUserFromDatabase(){
        return this.userFromDatabase;
    }

    getSignInUser(){
        return this.user;
    }
    getIdZMapy(){
        return this.idZMapy;
    }
    setIdZMapy(idzMap: any[]){
        this.idZMapy = idzMap;
    }
    getidEventZMapy(){
        return this.idEventZMapy;
    }


    setAktivity(akti: Activity[]){
        this.aktivity = akti;
    }
    getAktivitz(){
        return this.aktivity;
    }

    setEvent(event: Activity[]){
        this.event = event;
    }
    getEvent(){
        return this.event;
    }

}


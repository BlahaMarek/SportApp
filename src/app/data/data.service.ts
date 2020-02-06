import {Injectable} from '@angular/core';
import {Sport} from '../models/sport';
import {Activity} from "../models/activity";

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor() {
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
                icon: 'tennisball',
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
                icon: 'tennisball',
            },
            {
                label: 'Basketball',
                value: 8,
                tag: 1,
                icon: 'tennisball',
            },
            {
                label: 'Nohejbal',
                value: 9,
                tag: 1,
                icon: 'tennisball',
            }
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
}


import {Injectable} from '@angular/core';
import {Sport} from '../models/sport';

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
                userId: 'abc'
            },
            {
                label: 'Squash',
                value: 2,
                tag: 1,
                icon: 'squash',
                userId: 'abc'
            },
            {
                label: 'Stolný tenis',
                value: 3,
                tag: 1,
                icon: 'ping-pong',
                userId: 'xxx'
            },
            {
                label: 'Futbal',
                value: 4,
                tag: 1,
                icon: 'soccer',
                userId: 'xxx'
            },
            {
                label: 'Florbal',
                value: 5,
                tag: 1,
                icon: 'tennisball',
                userId: 'xxx'
            },
            {
                label: 'Hokej',
                value: 6,
                tag: 1,
                icon: 'hockey',
                userId: 'xxx'
            },
            {
                label: 'Volejbal',
                value: 7,
                tag: 1,
                icon: 'tennisball',
                userId: 'xxx'
            },
            {
                label: 'Basketball',
                value: 8,
                tag: 1,
                icon: 'tennisball',
                userId: 'xxx'
            },
            {
                label: 'Nohejbal',
                value: 9,
                tag: 1,
                icon: 'tennisball',
                userId: 'xxx'
            }
        ];
    }

    getSportNameByValue(val: number): string {
        return this.getSportsSk().find(item => item.value == val).label;
    }

    getSportIconByValue(val: number): string {
        return this.getSportsSk().find(item => item.value == val).icon;
    }
}


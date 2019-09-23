import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor() {
    }

    getSportsSk(){
        return [
            {
                label: 'Tenis',
                value: 1
            },
            {
                label: 'Squash',
                value: 2
            },
            {
                label: 'Stolný tenis',
                value: 3
            },
            {
                label: 'Futbal',
                value: 4
            },
            {
                label: 'Florbal',
                value: 5
            },
            {
                label: 'Hokej',
                value: 6
            },
            {
                label: 'Volejbal',
                value: 7
            },
            {
                label: 'Basketball',
                value: 8
            },
            {
                label: 'Nohejbal',
                value: 9
            }
        ];
    }
    getSportNameByValue(val: number): string {
      return this.getSportsSk().find(item => item.value == val).label;
    }
}


import {Injectable} from '@angular/core';
import {Activity} from '../models/activity';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ActivityService {
    private readonly _activities = new BehaviorSubject<Activity[]>([
        {
            id: 1,
            peopleCount: 10,
            place: 'Bratislava',
            sport: {
                label: 'Hokej',
                value: 6,
                tag: 1,
            },
            createdBy: 'xxx',
            topActivity: false,
            date: new Date('2019-12-24')
        },
        {
            id: 2,
            peopleCount: 1,
            place: 'Bratislava',
            sport: {
                label: 'Tenis',
                value: 1,
                tag: 1,
            },
            createdBy: 'xxx',
            topActivity: true,
            date: new Date('2019-08-17')
        },
        {
            id: 3,
            peopleCount: 10,
            place: 'Bratislava',
            sport: {
                label: 'Hokej',
                value: 6,
                tag: 1,
            },
            createdBy: 'abc',
            topActivity: false,
            date: new Date('2019-09-14')
        }, {
            id: 4,
            peopleCount: 1,
            place: 'Bratislava',
            sport: {
                label: 'Squash',
                value: 2,
                tag: 1,
            },
            createdBy: 'abc',
            topActivity: true,
            date: new Date('2019-04-09')
        },
        {
            id: 5,
            peopleCount: 1,
            place: 'Bratislava',
            sport: {
                label: 'Squash',
                value: 2,
                tag: 1,
            },
            createdBy: 'abc',
            topActivity: false,
            date: new Date('2019-01-05')
        },
        {
            id: 6,
            peopleCount: 5,
            place: 'Nitra',
            sport: {
                label: 'Futbal',
                value: 4,
                tag: 1,
            },
            createdBy: 'abc',
            topActivity: false,
            date: new Date('2019-01-02'),
        }
        ]);
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

    // get activity by id
    getActivityById(id: number): Activity {
        return this._activities.getValue().find(activity => activity.id === id);
    }

    // add new activity
    addActivity(activity: Activity) {
        this.activities = [
            ...this.activities,
            activity
        ]
    }

    // delete existing activity
    deleteActivity(id: number) {
        this.activities = this.activities.filter(activity => activity.id !== id);
    }
}

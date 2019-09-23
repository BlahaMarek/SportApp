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
                sportName: 'Hokej',
                sportType: 2
            },
            topActivity: false
        },
        {
            id: 2,
            peopleCount: 1,
            place: 'Bratislava',
            sport: {
                sportName: 'Tenis',
                sportType: 2
            },
            topActivity: false
        },
        {
            id: 1,
            peopleCount: 5,
            place: 'Nitra',
            sport: {
                sportName: 'Volejbal',
                sportType: 2
            },
            topActivity: false
        },
        {
            id: 3,
            peopleCount: 10,
            place: 'Bratislava',
            sport: {
                sportName: 'Hokej',
                sportType: 2
            },
            topActivity: false
        }, {
            id: 4,
            peopleCount: 1,
            place: 'Bratislava',
            sport: {
                sportName: 'Squash',
                sportType: 2
            },
            topActivity: false
        },
        {
            id: 5,
            peopleCount: 1,
            place: 'Bratislava',
            sport: {
                sportName: 'Squash',
                sportType: 2
            },
            topActivity: false
        }]);
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

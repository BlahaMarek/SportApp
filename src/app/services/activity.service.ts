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
            sport: 6,
            createdBy: 'xxx',
            topActivity: false,
            date: new Date('2019-12-24'),
            bookedBy: []
        },
        {
            id: 2,
            peopleCount: 1,
            place: 'Bratislava',
            sport: 1,
            createdBy: 'xxx',
            topActivity: true,
            date: new Date('2019-08-17'),
            bookedBy: []
        },
        {
            id: 3,
            peopleCount: 10,
            place: 'Bratislava',
            sport: 6,
            createdBy: 'abc',
            topActivity: false,
            date: new Date('2019-09-14'),
            bookedBy: ["xxx"]
        }, {
            id: 4,
            peopleCount: 1,
            place: 'Bratislava Test',
            sport: 2,
            createdBy: 'abc',
            topActivity: true,
            date: new Date('2019-04-09'),
            bookedBy: ["xxx"]
        },
        {
            id: 5,
            peopleCount: 1,
            place: 'Bratislava',
            sport: 2,
            createdBy: 'abc',
            topActivity: false,
            date: new Date('2019-01-05'),
            bookedBy: []
        },
        {
            id: 6,
            peopleCount: 5,
            place: 'Nitra',
            sport: 4,
            createdBy: 'abc',
            topActivity: false,
            date: new Date('2019-01-02'),
            bookedBy: []
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

    // add person, who booked activity to list of users, who booked
    addBookerToActivity(id: number, userId: string) {
        let activity: Activity = this.getActivityById(id);
        activity.bookedBy.push(userId);
        this.activities = [
            ...this.activities.filter(activity=> activity.id !== id),
            activity
        ]
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

import {Injectable} from '@angular/core';
import {Activity} from '../models/activity';

@Injectable({
    providedIn: 'root'
})
export class ActivityService {
    private activities: Activity[] = [];

    constructor() {
        this.activities = [
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
            }];
    }

    get getAllActivities(): Activity[] {
        return [...this.activities];
    }

    get allActivitiesCount(): number {
        return this.activities.length;
    }

    getActivityById(id: number): Activity {
        return {...this.activities.find(activity => activity.id === id)};
    }

    addActivity(activity: Activity) {
        this.activities.push(activity);
    }

    deleteActivity(id: number) {
        this.activities = this.activities.filter(activity => activity.id !== id);
    }
}

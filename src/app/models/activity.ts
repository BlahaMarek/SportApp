import { Sport } from './sport';

export class Activity {
    id: string;
    sport: number;
    peopleCount: number;
    place: string;
    topActivity: boolean;
    date: Date;
    bookedBy: string[];
    createdBy: string;
    lattitude: string;
    longtitude: string;
}

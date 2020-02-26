import { Sport } from './sport';

export class Activity {
    id?: string;
    sport?: number;
    peopleCount: number;
    topActivity?: boolean;

    place?: string;
    date?: Date;
    bookedBy?: string[];
    createdBy?: string;
    lattitude?: string;
    longtitude?: string;
    distanceFromUser?: number;
}

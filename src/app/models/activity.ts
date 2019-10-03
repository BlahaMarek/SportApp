import { Sport } from './sport';

export class Activity {
    id: number;
    sport: number;
    peopleCount: number;
    place: string;
    topActivity: boolean;
    date: Date;
    bookedBy: string[];
    createdBy: string;
}

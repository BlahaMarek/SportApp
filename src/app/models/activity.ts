import { Sport } from './sport';

export class Activity {
    id: number;
    sport: Sport;
    peopleCount: number;
    place: string;
    topActivity: boolean;
    date: Date;
    bookedBy?: string;
    createdBy: string;     //todo premiestni do activity, neviem co to tu robi je to picovina
}

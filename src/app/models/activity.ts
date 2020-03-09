import { Sport } from './sport';
import {Time} from "@angular/common";

export class Activity {
    id?: string;
    sport?: number;
    peopleCount: number;
    topActivity?: boolean;
    comment?: string;
    place?: string;
    date?: string;
    time?: Time;
    bookedBy?: string[];
    createdBy?: string;
    lattitude?: string;
    longtitude?: string;
    distanceFromUser?: number;
}

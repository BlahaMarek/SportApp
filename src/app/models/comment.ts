import { Sport } from './sport';
import {Time} from "@angular/common";

export class Comment {
    id?:string
    activitiId: string;
    time: number;
    replyToCommentId?: string;
    comment: string;
    userId: string;

    //chcel som to pomocou idcka ziskat, ale bugovalo to
    userName: string;
    photoUrl: string;

}

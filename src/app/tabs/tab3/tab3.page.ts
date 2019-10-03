import {Component} from '@angular/core';
import {MenuController} from '@ionic/angular';
import {Activity} from '../../models/activity';
import {ActivityService} from '../../services/activity.service';
import {AuthService} from '../../auth/auth.service';
import {DataService} from '../../data/data.service';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
    activityList: Activity[];
    filteredList:  Activity[];
    constructor(
        private activityService: ActivityService,
        private authService: AuthService,
        private dataService: DataService,
    ) {
    }

    ngOnInit() {
        this.activityService.activities$.subscribe(list => {
            this.activityList = list;
            this.activityList = this.activityList.sort((x, y) => (x.topActivity === y.topActivity) ? 0 : x.topActivity ? -1 : 1);
            this.filteredList = this.activityList.filter(activity => activity.bookedBy.includes(this.authService.userIdAuth));
        });
    }


}

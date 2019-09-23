import {Component, OnInit} from '@angular/core';
import {ActivityService} from '../../services/activity.service';
import {Activity} from '../../models/activity';
import {ModalController} from '@ionic/angular';
import {ActivityDetailComponent} from '../activity-detail/activity-detail.component';
import {Sport} from '../../models/sport';
import {DataService} from '../../data/data.service';
import {AuthService} from '../../auth/auth.service';

@Component({
    selector: 'app-activity-list',
    templateUrl: './activity-list.component.html',
    styleUrls: ['./activity-list.component.scss'],
})
export class ActivityListComponent implements OnInit {
    activityList: Activity[];
    activityListByUser: Activity[];
    filteredList: Activity[];
    sportOptions: Sport[] = [];

    constructor(
        private activityService: ActivityService,
        private modalController: ModalController,
        private dataService: DataService,
        private authService: AuthService
    ) {
        this.sportOptions = dataService.getSportsSk();
    }

    ngOnInit() {
        this.activityService.activities$.subscribe(list => {
            this.activityList = list;
            this.activityList = this.activityList.sort((x, y) => (x.topActivity === y.topActivity) ? 0 : x.topActivity ? -1 : 1);
            this.filteredList = this.activityList.filter(activity => activity.sport.userId !== this.authService.userIdAuth);
        })
    }

    onActivityClicked(id: number) {
        this.modalController
            .create({
                component: ActivityDetailComponent,
                componentProps: {selectedActivity: this.activityService.getActivityById(id)}
            })
            .then(modalEl => {
                modalEl.present();
                return modalEl.onDidDismiss();
            })
            .then(result => {
                console.log(result);
            });
    }

    onFilterUpdate(event: CustomEvent) {
        if (event.detail.value === 'others') {
            this.activityListByUser = this.activityList.filter(activity => activity.sport.userId !== this.authService.userIdAuth);
            this.filteredList = this.activityListByUser;
        } else if (event.detail.value === 'mine') {
            this.activityListByUser = this.activityList.filter(activity => activity.sport.userId === this.authService.userIdAuth);
            this.filteredList = this.activityListByUser;
        }
    }

    onSearchUpdate(event: CustomEvent) {
        if (event.detail.value === '') {
            this.filteredList = this.activityListByUser;
            return;
        }
        this.filteredList = this.activityListByUser.filter(activity => activity.sport.label.toUpperCase().includes(event.detail.value.toUpperCase()));
    }
}

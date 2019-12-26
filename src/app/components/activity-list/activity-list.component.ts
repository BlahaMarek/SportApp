import {Component, Input, OnInit} from '@angular/core';
import {ActivityService} from '../../services/activity.service';
import {Activity} from '../../models/activity';
import {ModalController, ToastController} from '@ionic/angular';
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

    @Input() filteredList: Activity[];
    sportOptions: Sport[] = [];

    constructor(
        private activityService: ActivityService,
        private modalController: ModalController,
        private toastController: ToastController,
        private dataService: DataService,
        private authService: AuthService
    ) {
    }

    ngOnInit() {
    }

    onActivityClicked(id: string) {
        this.modalController
            .create({
                component: ActivityDetailComponent,
                componentProps: {
                    selectedActivity: this.activityService.getActivityById(id),
                    bookable: !(this.activityService.getActivityById(id).createdBy === this.authService.userIdAuth)
                }
            })
            .then(modalEl => {
                modalEl.present();
                return modalEl.onDidDismiss();
            })
            .then(result => {
                console.log(result);
            });
    }

    getCssClass(activity: Activity) {
        return "item-content " + this.dataService.getSportIconByValue(activity.sport);
    }
}

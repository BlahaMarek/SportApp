import {Component, Input, OnInit} from '@angular/core';
import {ActivityService} from '../../services/activity.service';
import {Activity} from '../../models/activity';
import {ModalController} from '@ionic/angular';
import {ActivityDetailComponent} from '../activity-detail/activity-detail.component';

@Component({
    selector: 'app-activity-list',
    templateUrl: './activity-list.component.html',
    styleUrls: ['./activity-list.component.scss'],
})
export class ActivityListComponent implements OnInit {
    @Input() activityList: Activity[];
    constructor(
        private activityService: ActivityService,
        private modalController: ModalController
    ) {}

    ngOnInit() {}

    onActivityClicked(id: number) {
        console.log(id);
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
}

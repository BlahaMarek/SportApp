import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {ActivityService} from '../../services/activity.service';
import {Activity} from '../../models/activity';
import {Sport} from '../../models/sport';

@Component({
    selector: 'app-activity-new',
    templateUrl: './activity-new.component.html',
    styleUrls: ['./activity-new.component.scss'],
})
export class ActivityNewComponent implements OnInit {
    sportOptions = [{value: 0, label: 'A'}, {value: 1, label: 'B'}];

    constructor(
        private fb: FormBuilder,
        private modalController: ModalController,
        private activityService: ActivityService,
    ) {
    }

    activityForm = this.fb.group({
        peopleCount: [''],
        place: [''],
        topActivity: [false],
        sport: this.fb.group({
            sportType: [''],
        }),
    });

    ngOnInit() {
    }

    onCancel() {
        this.modalController.dismiss({message: 'Close new activity!'}, 'cancel');
    }

    onFormSubmit() {
        this.activityService.addActivity(this.assignValueToActivity());
        this.modalController.dismiss({message: 'Add new activity!'}, 'add');
    }

    assignValueToActivity(): Activity {
        const activity: Activity = {
            id: this.activityService.allActivitiesCount + 1,
            sport: {sportName: '', sportType: null},
            topActivity: this.activityForm.get('topActivity').value,
            place: this.activityForm.get('place').value,
            peopleCount: this.activityForm.get('peopleCount').value
        };
        return activity;
    }
}

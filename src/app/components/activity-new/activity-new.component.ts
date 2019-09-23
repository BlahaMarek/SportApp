import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {ActivityService} from '../../services/activity.service';
import {Activity} from '../../models/activity';
import {DataService} from '../../data/data.service';
import {Sport} from '../../models/sport';
import {AuthService} from '../../auth/auth.service';

@Component({
    selector: 'app-activity-new',
    templateUrl: './activity-new.component.html',
    styleUrls: ['./activity-new.component.scss'],
})
export class ActivityNewComponent implements OnInit {
    sportOptions: Sport[] = [];

    constructor(
        private fb: FormBuilder,
        private modalController: ModalController,
        private activityService: ActivityService,
        private dataService: DataService,
        private authService: AuthService
    ) {
        this.sportOptions = this.dataService.getSportsSk();
    }

    activityForm = this.fb.group({
        peopleCount: ['', Validators.required],
        place: ['', Validators.required],
        topActivity: [false],
        date: ['', Validators.required],
        sport: this.fb.group({
            sportType: ['', Validators.required],
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
        return{
            id: this.activityService.allActivitiesCount + 1,
            sport: {
                label: this.dataService.getSportNameByValue(this.activityForm.get('sport.sportType').value),
                value: this.activityForm.get('sport.sportType').value,
                tag: 1,
                userId: this.authService.userIdAuth
            },
            topActivity: this.activityForm.get('topActivity').value,
            place: this.activityForm.get('place').value,
            peopleCount: this.activityForm.get('peopleCount').value,
            date: this.activityForm.get('date').value
        };
    }
}

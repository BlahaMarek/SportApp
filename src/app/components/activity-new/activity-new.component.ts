import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {ActivityService} from '../../services/activity.service';
import {Activity} from '../../models/activity';
import {DataService} from '../../data/data.service';
import {Sport} from '../../models/sport';

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
    ) {
        this.sportOptions = this.dataService.getSportsSk();
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
        console.log(this.sportOptions);
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
                tag: 1
            },
            topActivity: this.activityForm.get('topActivity').value,
            place: this.activityForm.get('place').value,
            peopleCount: this.activityForm.get('peopleCount').value
        };
    }
}

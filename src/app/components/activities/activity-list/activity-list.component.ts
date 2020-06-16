import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {Activity} from '../../../models/activity';
import {ModalController, ToastController} from '@ionic/angular';
import {ActivityDetailComponent} from '../activity-detail/activity-detail.component';
import {Sport} from '../../../models/sport';
import {DataService} from '../../../data/data.service';

@Component({
    selector: 'app-activity-list',
    templateUrl: './activity-list.component.html',
    styleUrls: ['./activity-list.component.scss'],
})
export class ActivityListComponent implements OnInit {

    @Input() filteredList: Activity[];
    @Input() idSportsFromMap: string[];
    @Input() fromMap: boolean;

    sportOptions: Sport[] = [];
    user: any = {};
    segmentValue = 'others';
    filterCriteria = [];
    constructor(
        private activityService: ActivityService,
        private modalController: ModalController,
        private toastController: ToastController,
        private dataService: DataService,
    ) {
    }

    ngOnInit() {
        this.user = this.dataService.getSignInUser();
        if (this.fromMap) {
            this.filterActivitiesByIdFromMap();
        }
    }

    onActivityClicked(id: string) {
        this.user= this.dataService.getSignInUser();
        var logged= this.dataService.getSignInUser();
        if (this.dataService.logged != false) {
            this.modalController
                .create({
                    component: ActivityDetailComponent,
                    componentProps: {
                        selectedActivity: this.activityService.getActivityById(id),
                        bookable: !(this.activityService.getActivityById(id).createdBy === this.user.user.uid),
                        reserved: (this.activityService.getActivityById(id).bookedBy.find(function (prihlaseny) {
                            return prihlaseny.includes(logged.user.uid)
                        })),
                        overdue: (new Date(this.activityService.getActivityById(id).date).getTime() < new Date().getTime()),
                        unSigned: (this.user.user.uid == 0)
                    }
                })
                .then(modalEl => {
                    modalEl.present();
                    return modalEl.onDidDismiss();
                });
        }
    }

    //ak pridem z mapy filitrujem len tie aktivity
    filterActivitiesByIdFromMap(){
        this.filteredList = this.dataService.getAktivitz().filter(aktivita => this.idSportsFromMap.includes(aktivita.id));
    }

    getCssClass(activity: Activity) {
        return "item-content " + this.dataService.getSportIconByValue(activity.sport);
    }

    onSearchClicked(data) {
        this.filterCriteria = data;
    }
    onCancel() {
        this.modalController.dismiss({message: 'ActivityList closed'}, 'cancel');
    }

}

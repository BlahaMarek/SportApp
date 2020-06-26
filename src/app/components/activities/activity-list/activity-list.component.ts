import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {Activity} from '../../../models/activity';
import {ModalController, ToastController} from '@ionic/angular';
import {ActivityDetailComponent} from '../activity-detail/activity-detail.component';
import {Sport} from '../../../models/sport';
import {DataService} from '../../../data/data.service';
import {animate, animateChild, query, stagger, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'app-activity-list',
    templateUrl: './activity-list.component.html',
    styleUrls: ['./activity-list.component.scss'],
})
export class ActivityListComponent implements OnInit {

    @Input() filteredList: Activity[];
    @Input() idSportsFromMap: string[];
    @Input() fromMap: boolean;
    @Input() aktivita: boolean; //ci prisiel event z mapy alebo aktivita

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
        console.log("this is filteredlist")
        console.log(this.filteredList);
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
                        bookable: !(this.activityService.getActivityById(id).createdBy === this.user.id),
                        reserved: (this.activityService.getActivityById(id).bookedBy.find(function (prihlaseny) {
                            return prihlaseny.includes(logged.id)
                        })),
                        overdue: (new Date(this.activityService.getActivityById(id).date).getTime() < new Date().getTime()),
                        unSigned: (this.user.id == 0)
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
        if (this.aktivita) {
            this.filteredList = this.dataService.getAktivitz().filter(aktivita => this.idSportsFromMap.includes(aktivita.id));
        }else
            this.filteredList = this.dataService.getEvent().filter(aktivita => this.idSportsFromMap.includes(aktivita.id));

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

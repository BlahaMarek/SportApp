import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {Activity} from '../../../models/activity';
import {ModalController, ToastController} from '@ionic/angular';
import {ActivityDetailComponent} from '../activity-detail/activity-detail.component';
import {Sport} from '../../../models/sport';
import {DataService} from '../../../data/data.service';
import {animate, animateChild, query, stagger, style, transition, trigger} from '@angular/animations';
import {EventService} from "../../../services/event.service";

@Component({
    selector: 'app-activity-list',
    templateUrl: './activity-list.component.html',
    styleUrls: ['./activity-list.component.scss'],
})
export class ActivityListComponent implements OnInit {

    @Input() filteredList: Activity[];
    @Input() idSportsFromMap: string[];
    @Input() fromMap: boolean;
    @Input() fromEvent: boolean;
    @Input() finishDownloading: boolean;

    @Input() aktivita: boolean; //ci prisiel event z mapy alebo aktivita

    sportOptions: Sport[] = [];
    user: any = {};
    segmentValue = 'others';
    filterCriteria = [];
    virtualIndex = 1;
    constructor(
        private activityService: ActivityService,
        private modalController: ModalController,
        private toastController: ToastController,
        private dataService: DataService,
        private eventService: EventService
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
        if (this.fromEvent){
            var eventik = this.eventService.getEventById(id);
            this.modalController
                .create({
                    component: ActivityDetailComponent,
                    componentProps: {
                        selectedActivity: eventik,
                        bookable: !(eventik.createdBy === this.user.id),
                        reserved: (eventik.bookedBy.find(function (prihlaseny) {
                            return prihlaseny.includes(logged.id)
                        })),
                        overdue: (new Date(eventik.date).getTime() < new Date().getTime()),
                        unSigned: (this.user.id == 0),
                        fromEvent: true
                    }
                })
                .then(modalEl => {
                    modalEl.present();
                    return modalEl.onDidDismiss();
                });
        }else {


            if (this.dataService.logged != false) {
                var aktivita = this.activityService.getActivityById(id)
                this.modalController
                    .create({
                        component: ActivityDetailComponent,
                        componentProps: {
                            selectedActivity: aktivita,
                            bookable: !(aktivita.createdBy === this.user.id),
                            reserved: (aktivita.bookedBy.find(function (prihlaseny) {
                                return prihlaseny.includes(logged.id)
                            })),
                            overdue: (new Date(aktivita.date).getTime() < new Date().getTime()),
                            unSigned: (this.user.id == 0),
                            fromEvent: false
                        }
                    })
                    .then(modalEl => {
                        modalEl.present();
                        return modalEl.onDidDismiss();
                    });
            }
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

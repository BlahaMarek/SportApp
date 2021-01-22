import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
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

    internet:boolean;


    @ViewChild('assigned', {static: false}) myDiv: ElementRef;

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
        this.dataService.internet$.subscribe(int=>{
            this.internet = int;
        })
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
                        fromEvent: true
                    }
                })
                .then(modalEl => {
                    modalEl.present();
                    const data = modalEl.onDidDismiss();
                    console.log(data);
                    return modalEl.onDidDismiss();
                });
        }else {


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
                        modalEl.onDidDismiss().then(data => {
                            //animacia na tlacitku ,,elementhref mi nechcel ist preto cez id, asi som lama
                            if (data.data.message == 'add'){
                                    document.getElementById("prihlaseny").classList.add("blick")
                            }else if(data.data.message == 'remove'){
                                document.getElementById("vsetky").classList.add("blick")
                            }

                            setTimeout(() => {
                                document.getElementById("prihlaseny").classList.remove("blick")
                                document.getElementById("vsetky").classList.remove("blick")
                            }, 1500);
                        });
                        return modalEl.onDidDismiss();
                    });
        }
    }



    //ak pridem z mapy filitrujem len tie aktivity
    filterActivitiesByIdFromMap(){
        console.log(this.idSportsFromMap)
        if (this.aktivita) {
            this.activityService.activities$.subscribe(aktivity => {
                this.filteredList = aktivity.filter(aktivita => this.idSportsFromMap.includes(aktivita.id));
            });

        }else{
            this.eventService.activities$.subscribe(events => {
                this.filteredList = events.filter(aktivita => this.idSportsFromMap.includes(aktivita.id));
            });
        }
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

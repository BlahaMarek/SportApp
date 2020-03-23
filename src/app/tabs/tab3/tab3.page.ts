import {Component, ElementRef, NgZone, ViewChild} from '@angular/core';
import {MenuController, ModalController, ToastController} from '@ionic/angular';
import {Activity} from '../../models/activity';
import {ActivityService} from '../../services/activity.service';
import {AuthService} from '../../auth/auth.service';
import {DataService} from '../../data/data.service';
import {ActivityNewComponent} from "../../components/activities/activity-new/activity-new.component";
import {EventNewComponent} from "../../components/events/event-new/event-new.component";
import {FormBuilder} from "@angular/forms";
import {LanguageService} from "../../services/language.service";
import {Geolocation} from "@ionic-native/geolocation/ngx";
import {EventService} from "../../services/event.service";

let a1;
let b1;

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
    // @ts-ignore
    @ViewChild('others') others: ElementRef;
    activityList: Activity[];
    activityListByUser: Activity[];

    filteredList: Activity[];
    sportOptions: any;
    segment: any;
    porovnavaciDate: Date;

    products: any[] =[];
    latitude = 0;
    longitude = 0;
    hodnota;
    hodnota2;
    vysledok;


    constructor(
        public zone: NgZone,
        private fb: FormBuilder,
        private modalController: ModalController,
        private toastController: ToastController,
        private languageService: LanguageService,
        private eventService: EventService,
        private authService: AuthService,
        private dataService: DataService,
        private geolocation: Geolocation,

    ) {
        this.segment = "others";
        this.sportOptions = dataService.getSportsSk();
        this.initApp();
    }
    locate() {
        this.geolocation.getCurrentPosition().then((resp) => {
            a1 = resp.coords.latitude ;
            b1 = resp.coords.longitude;
            this.longitude = resp.coords.longitude;
            console.log("Toto je latitude");
            console.log(this.latitude);
        }).catch((error) => {
            console.log('Error getting location', error);
        });
    }

    ngOnInit() {
        var porovnavaciDate = new Date();
        this.locate();
        this.eventService.activities$.subscribe(list => {
            this.activityList = list;


            //moja ultra total algo na zoradenie aktivit podla polohy

            this.activityList.forEach(function (value) {
                var hodnota = parseFloat(value.lattitude) - 48.717110; // tu ma byt poloha pouzivatela ...a1 b1

                var hodnota2 = parseFloat(value.longtitude) - 21.259781;

                if (hodnota < 0){
                    hodnota = hodnota *-1;
                }
                if (hodnota2<0){
                    hodnota2 = hodnota2 *-1;
                }
                value.distanceFromUser = hodnota + hodnota2;


            });


            this.activityList = this.activityList.sort(function(a,b){
                return a.distanceFromUser - b.distanceFromUser
            });
            this.filteredList = this.activityList.filter(activity => ((activity.createdBy !== this.authService.userIdAuth ) && (activity.peopleCount > activity.bookedBy.length)
                && !activity.bookedBy.includes(this.authService.userIdAuth) && (new Date(activity.date).getTime() > porovnavaciDate.getTime())));

        });

    }

    initApp() {
        this.languageService.setInitialAppLanguage();
    }


    onFilterUpdate(event: CustomEvent) {
        this.porovnavaciDate = new Date();
        if (event.detail.value === 'others') {
            this.activityListByUser = this.activityList.filter(activity => ((activity.createdBy !== this.authService.userIdAuth ) &&
                (activity.peopleCount > activity.bookedBy.length) && (new Date(activity.date).getTime() >= this.porovnavaciDate.getTime()) && !activity.bookedBy.includes(this.authService.userIdAuth)));
            this.filteredList = this.activityListByUser;

        } else if (event.detail.value === 'mine') {
            this.activityListByUser = this.activityList.filter(activity => activity.createdBy === this.authService.userIdAuth);
            this.filteredList = this.activityListByUser;
            this.filteredList.sort(function(a,b){
                return new Date(b.date).getTime() - new Date(a.date).getTime()
            });
        }else if(event.detail.value === 'registered'){
            let hovno = [];
            let prihlaseny = this.authService.userIdAuth;
            this.activityListByUser = this.activityList.filter(activity => activity.bookedBy.forEach(function(value) {
                if (value === prihlaseny){
                    hovno.push(activity);

                    //this.hovno.push(activity);
                    console.log(activity);
                }

            }));
            this.filteredList = hovno;
            this.filteredList.sort(function(a,b){
                return new Date(b.date).getTime() - new Date(a.date).getTime()
            });

        }
    }

    onSearchUpdate(event: CustomEvent) {
        if (event.detail.value === '') {
            this.filteredList = this.activityListByUser;
            return;
        }
        this.filteredList = this.activityListByUser.filter(activity => this.dataService.getSportNameByValue(activity.sport).toUpperCase().includes(event.detail.value.toUpperCase()));
    }

    onFabClicked(event: MouseEvent) {
        alert('Sem pojde filter152 !');
    }

    presentModal() {
        this.modalController
            .create({component: EventNewComponent})
            .then(modalEl => {
                this.segment = "others";
                modalEl.present();
                return modalEl.onDidDismiss();
            })
            .then(result => {
                console.log(result);

                if (result.role !== 'cancel') {
                    this.presentToast();
                }
            });
    }
    async presentToast() {
        const toast = await this.toastController.create({
            message: 'Udalost bola úspešne pridaná.',
            duration: 2000,
            color: 'medium'
        });
        toast.present();
    }
}


import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MenuController, ModalController, ToastController} from '@ionic/angular';
import {ActivityNewComponent} from '../../components/activity-new/activity-new.component';
import {LanguageService} from '../../services/language.service';
import {Activity} from '../../models/activity';
import {ActivityService} from '../../services/activity.service';
import {AuthService} from '../../auth/auth.service';
import {DataService} from '../../data/data.service';
import * as firebase from "firebase";
import {forEach} from "@angular-devkit/schematics";
import {Geolocation} from "@ionic-native/geolocation/ngx";

let a1;
let b1;
var zoradeneSporty = []
@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
    // @ts-ignore
    @ViewChild('others') others: ElementRef;
    activityList: Activity[];
    activityListByUser: Activity[];

    filteredList: Activity[];
    sportOptions: any;
    segment: any;
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
        private activityService: ActivityService,
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
        var datum = new Date();
        var rok = datum.getFullYear();
         var day = datum.getDate();
        var mesiac = datum.getMonth();
        mesiac = mesiac +1;
        console.log("toto je dnesny den: " + day +  "mesiac : " + mesiac +  "rok:  "  + rok);
        var porovnavaciDate = new Date();
        porovnavaciDate.setFullYear(rok);
        porovnavaciDate.setMonth(mesiac);
        porovnavaciDate.setDate(day);
        console.log("moj rocik " + porovnavaciDate);
        this.locate();
        this.activityService.activities$.subscribe(list => {
            this.activityList = list;
            ////
            //moja ultra total algo na zoradenie aktivit podla polohy

            this.activityList.forEach(function (value) { // toto je ultra mega total algo, ktory zatial zobrazuje len podla polohy aktivity..aspon dufam..ale top na vrchu nie su

                    console.log("toto je datum aktivity");
                console.log(value.date);

                var hodnota = parseFloat(value.lattitude) - 48.717110;

                var hodnota2 = parseFloat(value.longtitude) - 21.259781;

                if (hodnota < 0){
                    hodnota = hodnota *-1;
                }
                if (hodnota2<0){
                    hodnota2 = hodnota2 *-1;
                }
                value.distanceFromUser = hodnota + hodnota2;


            });

///
            this.activityList = this.activityList.sort(function(a,b){
                return a.distanceFromUser - b.distanceFromUser
            });
            this.filteredList = this.activityList.filter(activity => ((activity.createdBy !== this.authService.userIdAuth ) && (activity.peopleCount > activity.bookedBy.length)
                && !activity.bookedBy.includes(this.authService.userIdAuth)));

        });

    }

    initApp() {
        this.languageService.setInitialAppLanguage();
    }


    onFilterUpdate(event: CustomEvent) {

        if (event.detail.value === 'others') {
            this.activityListByUser = this.activityList.filter(activity => ((activity.createdBy !== this.authService.userIdAuth ) && (activity.peopleCount > activity.bookedBy.length) && !activity.bookedBy.includes(this.authService.userIdAuth)));
            this.filteredList = this.activityListByUser;
        } else if (event.detail.value === 'mine') {
            this.activityListByUser = this.activityList.filter(activity => activity.createdBy === this.authService.userIdAuth);
            this.filteredList = this.activityListByUser;
        }else if(event.detail.value === 'registered'){
            let hovno = [];
            let prihlaseny = this.authService.userIdAuth;
                this.activityListByUser = this.activityList.filter(activity => activity.bookedBy.forEach(function(value) {
                    if (value === prihlaseny){
                        hovno.push(activity);

                        //this.hovno.push(activity);
                        console.log(activity);
                    }
                    console.log("toto je moja value// " + value);

                }));
            this.filteredList = hovno;


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
        alert('Sem pojde filter !');
    }

    presentModal() {
        this.modalController
            .create({component: ActivityNewComponent})
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
            message: 'Aktivita bola úspešne pridaná.',
            duration: 2000,
            color: 'medium'
        });
        toast.present();
    }
}

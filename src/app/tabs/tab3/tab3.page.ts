import {Component} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {Activity} from '../../models/activity';
import {AuthService} from '../../auth/auth.service';
import {DataService} from '../../data/data.service';
import {ActivityNewComponent} from "../../components/activities/activity-new/activity-new.component";
import {LanguageService} from "../../services/language.service";
import {Geolocation} from "@ionic-native/geolocation/ngx";
import {EventService} from "../../services/event.service";

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
    activityList: Activity[];
    fromEvent: true;
    latitude = null;
    longitude = null;
    idEventZMapy: any = [];


    constructor(
        private modalController: ModalController,
        private toastController: ToastController,
        private languageService: LanguageService,
        private eventService: EventService,
        private authService: AuthService,
        private dataService: DataService,
        private geolocation: Geolocation,
    ) {
        this.initApp();
    }

    ngOnInit() {
        this.locate();
        this.fromEvent = true;
        this.eventService.activities$.subscribe(list => {
            this.activityList = list;
                console.log(list)
            console.log("pro")

            // SORTOVANIE AKTIVIT PODLA VZDIALENOSTI
            this.activityList.forEach(value => {
                let v1 = Math.abs(parseFloat(value.lattitude) - this.latitude);
                let v2 = Math.abs(parseFloat(value.longtitude) - this.longitude);
                value.distanceFromUser = v1 + v2;
            });

            this.activityList.sort(function(a,b){
                return a.distanceFromUser - b.distanceFromUser
            });
            this.dataService.setEvent(this.activityList);
        });
    }

    // NASTAVENIE JAZYKA APLIKACIE
    initApp() {
        this.languageService.setInitialAppLanguage();
    }

    // GEOLOKACIA USERA
    locate() {
        this.geolocation.getCurrentPosition().then((resp) => {
            this.latitude = resp.coords.latitude;
            this.longitude = resp.coords.longitude;
        }).catch((error) => {console.error(error)});
    }

    // OTVORENIE NOVEJ AKTIVITY
    presentModal() {
        this.modalController
            .create({component: ActivityNewComponent})
            .then(modalEl => {
                modalEl.present();
                return modalEl.onDidDismiss();
            })
            .then(result => {
                if (result.role !== 'cancel') {
                    this.presentToast();
                }
            });
    }

    // TODO: POROZMYSLAJME, CI NESPRAVIME SERVISU PRE TOASTY A PODOBNE SRACKY, ABY SME NEMUSELI
    //       TAKYTO DLHY SKAREDY KOD PISAT MILIONKRAT
    // AK JE AKTIVITA USPESNE VYTVORENA, UKAZ TOAST
    async presentToast() {
        const toast = await this.toastController.create({
            message: 'Aktivita bola úspešne pridaná.',
            duration: 2000,
            color: 'medium'
        });
        toast.present();
    }
}

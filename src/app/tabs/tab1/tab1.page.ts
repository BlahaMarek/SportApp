import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {ActivityNewComponent} from '../../components/activities/activity-new/activity-new.component';
import {LanguageService} from '../../services/language.service';
import {Activity} from '../../models/activity';
import {ActivityService} from '../../services/activity.service';
import {AuthService} from '../../auth/auth.service';
import {DataService} from '../../data/data.service';
import {Geolocation} from "@ionic-native/geolocation/ngx";

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
    activityList: Activity[];
    fromEvent: false;
    finishDownloading = false;
    latitude = null;
    longitude = null;
    internet:boolean;

    @ViewChild('mine', {static: false, read: ElementRef }) buttonMoje: ElementRef;

    constructor(
        private modalController: ModalController,
        private toastController: ToastController,
        private languageService: LanguageService,
        private activityService: ActivityService,
        private authService: AuthService,
        public dataService: DataService,
        private geolocation: Geolocation,
    ) {
        this.initApp();
    }

    async ngOnInit() {
        this.loadLocalUser();
        this.locate();
        this.fromEvent = false;
         this.activityService.activities$.subscribe(list => {
            this.activityList = list;
            // SORTOVANIE AKTIVIT PODLA VZDIALENOSTI
            this.activityList.forEach(value => {
                let v1 = Math.abs(parseFloat(value.lattitude) - this.latitude);
                let v2 = Math.abs(parseFloat(value.longtitude) - this.longitude);
                value.distanceFromUser = v1 + v2;
            });

            this.activityList.sort(function(a,b){
                return a.distanceFromUser - b.distanceFromUser
            });
            this.finishDownloading = true;
         });
    this.dataService.internet$.subscribe(int=>{
        this.internet = int;
    })
    }

    // NASTAVENIE JAZYKA APLIKACIE
    initApp() {
        this.languageService.setInitialAppLanguage();
    }

    // NACITANIE USERA Z LOCALSTORAGE, ABY SA NEMUSEL PRIHLASOVAT
    loadLocalUser() {
        if (localStorage.getItem('user')){
            this.dataService.userFromDatabase = JSON.parse(localStorage.getItem('user'));
        }
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

                modalEl.onDidDismiss().then(data => {
                    console.log(this.buttonMoje)

                    //animacia na tlacitku ,,elementhref mi nechcel ist preto cez id, asi som lama
                    if (data.role == 'add') {
                        document.getElementById("moje").classList.add("blick")
                    }
                    setTimeout(() => {
                        document.getElementById("moje").classList.remove("blick")
                    }, 1500);
                });

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

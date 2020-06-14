import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ModalController, ToastController} from '@ionic/angular';
import {ActivityNewComponent} from '../../components/activities/activity-new/activity-new.component';
import {LanguageService} from '../../services/language.service';
import {Activity} from '../../models/activity';
import {ActivityService} from '../../services/activity.service';
import {AuthService} from '../../auth/auth.service';
import {DataService} from '../../data/data.service';
import {Geolocation} from "@ionic-native/geolocation/ngx";
import {Router} from "@angular/router";

let a1;
let b1;
@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
    @ViewChild('others', {static: true}) others: ElementRef;
    activityList: Activity[];
    activityListByUser: Activity[];
    user: any = {};
    idZMapy: any = [];
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
        private activityService: ActivityService,
        private authService: AuthService,
        private dataService: DataService,
        private geolocation: Geolocation,
        private router: Router,

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
        }).catch((error) => {
        });
    }
    ionViewWillEnter(){
        this.idZMapy = this.dataService.getIdZMapy();
        this.dataService.refreshAfterLogin = false;
    }

    ngOnInit() {
        if (localStorage.getItem('user')){
            this.dataService.user = JSON.parse(localStorage.getItem('user'));
            this.dataService.logged = true;
            this.dataService.refreshAfterLogin = true;
        }
        console.log(this.dataService.getSignInUser());
        this.user = this.dataService.getSignInUser();
        if (Object.keys(this.user).length == 0){
            this.dataService.logged = false;
        }
        var porovnavaciDate = new Date();
        this.locate();
        this.activityService.activities$.subscribe(list => {
            this.activityList = list;

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
            if(this.dataService.logged != false) {
                this.filteredList = this.activityList.filter(activity => ((activity.createdBy !== this.user.user.uid) && (activity.peopleCount > activity.bookedBy.length)
                    && !activity.bookedBy.includes(this.user.user.uid) && (new Date(activity.date).getTime() > porovnavaciDate.getTime())));
                this.dataService.setAktivity(this.filteredList);
            }
            else{
                this.filteredList = this.activityList.filter(activity => ((activity.peopleCount > activity.bookedBy.length)
                    && (new Date(activity.date).getTime() > porovnavaciDate.getTime())));
                this.dataService.setAktivity(this.filteredList);
            }
        });
    }

    initApp() {
        this.languageService.setInitialAppLanguage();
    }

    onFilterUpdate(event: CustomEvent) {
        this.porovnavaciDate = new Date();
        if(this.dataService.logged != false) {

            if (event.detail.value === 'others') {
                this.activityListByUser = this.activityList.filter(activity => ((activity.createdBy !== this.user.user.uid) &&
                    (activity.peopleCount > activity.bookedBy.length) && (new Date(activity.date).getTime() >= this.porovnavaciDate.getTime()) && !activity.bookedBy.includes(this.user.user.uid)));
                this.filteredList = this.activityListByUser;
                console.log("neviem ci tu mam byt")

            } else if (event.detail.value === 'mine') {
                this.activityListByUser = this.activityList.filter(activity => activity.createdBy === this.user.user.uid);
                this.filteredList = this.activityListByUser;
                this.filteredList.sort(function (a, b) {
                    return new Date(b.date).getTime() - new Date(a.date).getTime()
                });
            } else if (event.detail.value === 'registered') {
                //TODO: Really hovno? :D
                let hovno = [];
                let prihlaseny = this.user.user.uid;
                this.activityListByUser = this.activityList.filter(activity => activity.bookedBy.forEach(function (value) {
                    if (value === prihlaseny) {
                        hovno.push(activity);
                        console.log(activity);
                    }
                }));
                this.filteredList = hovno;
                this.filteredList.sort(function (a, b) {
                    return new Date(b.date).getTime() - new Date(a.date).getTime()
                });
            }
        }else{
            if (event.detail.value === 'others') {
                this.activityListByUser = this.activityList.filter(activity => ((activity.createdBy !== "guest") &&
                    (activity.peopleCount > activity.bookedBy.length) && (new Date(activity.date).getTime() >= this.porovnavaciDate.getTime()) && !activity.bookedBy.includes("guest")));
                this.filteredList = this.activityListByUser;
            }
            else if (event.detail.value === 'mine') {
                this.filteredList = [];
            } else if (event.detail.value === 'registered') {
                this.filteredList = [];
            }
        }
    }

    onSearchUpdate(event: CustomEvent) {
        this.filteredList = this.activityListByUser.filter(activity => this.dataService.getSportNameByValue(activity.sport).toUpperCase().includes(event.detail.value.toUpperCase()));
    }

    onSearchUpdateId(event: CustomEvent) {
        let pole: string[] = [];
        let slovo:string = "";
        for (var i = 0; i < event.detail.value.length; i++ ){ // tu si z filtra robim pole ..tam to je vsetko v stringu
            if (event.detail.value[i] == ","){
                pole.push(slovo); // v poli mam jednotlive idcka aktivit
                slovo = "";
            }else if (i+1 == event.detail.value.length){
                slovo += event.detail.value[i];
                pole.push(slovo);
                slovo ="";
            }
            else {
                slovo += event.detail.value[i];
            }
        }

        let aktivityFiltrovane:Activity[] = [];
        this.filteredList = this.activityList.filter(activity => pole.forEach(function (number) {
            if (number == activity.id){
                console.log("som nasiel prvok pro")
                aktivityFiltrovane.push(activity);
            }

        }));
        this.filteredList = aktivityFiltrovane;
        aktivityFiltrovane = [];
        pole = [];
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
    login() {
        this.router.navigateByUrl('/login');
    }

    onActivityClosed(data) {
        this.segment = "others";
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

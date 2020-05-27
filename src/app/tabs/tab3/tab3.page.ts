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
import {Router} from "@angular/router";

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
    user: any = {};
    filteredList: Activity[];
    sportOptions: any;
    segment: any;
    porovnavaciDate: Date;
    idEventZMapy: any = [];
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
            console.log("Toto je latitude");
            console.log(this.latitude);
        }).catch((error) => {
            console.log('Error getting location', error);
        });
    }
    ionViewWillEnter(){
        //  if(this.dataService.refreshAfterLogin == true){ // aby sa vzdy nacitali spravne aktivity
        console.log("Ion enter");
        this.idEventZMapy = this.dataService.getidEventZMapy();
        console.log(this.dataService.getidEventZMapy());


    }

    ngOnInit() {
        this.user = this.dataService.getSignInUser();
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

            if(this.dataService.logged != false) { //prihlaseny
                this.filteredList = this.activityList.filter(activity => ((activity.createdBy !== this.user.user.uid) // tu som par veci premazal
                    && (new Date(activity.date).getTime() > porovnavaciDate.getTime())));
                this.dataService.setEvent(this.filteredList);
                this.activityListByUser = this.filteredList; // bez tohto nesiel filter na zaciatku..az po prekliknuti na moje aktivity
            }
            else{ //neprihlaseny
                this.filteredList = this.activityList.filter(activity => ((new Date(activity.date).getTime() > porovnavaciDate.getTime())));
                this.dataService.setEvent(this.filteredList);
                this.activityListByUser = this.filteredList;
            }
        });

    }

    initApp() {
        this.languageService.setInitialAppLanguage();
    }


    onFilterUpdate(event: CustomEvent) {
        this.porovnavaciDate = new Date();
        if(this.dataService.logged != false) { //prihlaseny

            if (event.detail.value === 'others') {
                this.activityListByUser = this.activityList.filter(activity => ((activity.createdBy !== this.user.user.uid) &&
                     (new Date(activity.date).getTime() >= this.porovnavaciDate.getTime()) && !activity.bookedBy.includes(this.user.user.uid)));
                this.filteredList = this.activityListByUser;

            } else if (event.detail.value === 'mine') {
                this.activityListByUser = this.activityList.filter(activity => activity.createdBy === this.user.user.uid);
                this.filteredList = this.activityListByUser;
                this.filteredList.sort(function (a, b) {
                    return new Date(b.date).getTime() - new Date(a.date).getTime()
                });
            } else if (event.detail.value === 'registered') {
                let hovno = [];
                let prihlaseny = this.user.user.uid;
                this.activityListByUser = this.activityList.filter(activity => activity.bookedBy.forEach(function (value) {
                    if (value === prihlaseny) {
                        hovno.push(activity);
                    }

                }));
                this.filteredList = hovno;
                this.filteredList.sort(function (a, b) {
                    return new Date(b.date).getTime() - new Date(a.date).getTime()
                });

            }
        }else{ //neprihlaseny
            if (event.detail.value === 'others') {
                this.activityListByUser = this.activityList.filter(activity => ((new Date(activity.date).getTime() >= this.porovnavaciDate.getTime())));
                this.filteredList = this.activityListByUser;
                console.log("som v srackach");
                console.log("filteredlist");
                console.log(this.filteredList);
                console.log("activitylist");
                console.log(this.activityList);

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

        console.log("totot je id z mapy");
        console.log(this.idEventZMapy);
        console.log(event.detail.value);

        console.log(event.detail.value[0]);
        let pole: string[] = [];
        let slovo:string = "";
        for (var i = 0; i < event.detail.value.length; i++ ){ // tu si z filtra robim pole ..tam to je vsetko v stringu
            if (event.detail.value[i] == ","){
                console.log("nasel som ciarku ,[pro");
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

    onFabClicked(event: MouseEvent) {
        alert('Sem pojde filter !');
    }
    login() {
        this.router.navigateByUrl('/login');
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
                    this.idEventZMapy = " "; //toto mozno urobi reaload, neodkusane
                    this.idEventZMapy = "";
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

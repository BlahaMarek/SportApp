import {AfterViewInit, Component, Input, NgZone, OnInit} from '@angular/core';
import {Activity} from '../../../models/activity';
import {AlertController, ModalController, Platform, ToastController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Sport} from '../../../models/sport';
import {DataService} from '../../../data/data.service';
import {ActivityService} from '../../../services/activity.service';
import {AuthService} from '../../../auth/auth.service';
import {NativeGeocoderOptions, NativeGeocoderResult} from '@ionic-native/native-geocoder';
import {NativeGeocoder} from '@ionic-native/native-geocoder/ngx';
import 'ol/ol.css';
import Feature from 'ol/Feature';
import {fromLonLat} from 'ol/proj';
import Map from 'ol/Map';
import View from 'ol/View';
import Point from 'ol/geom/Point';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {ActivatedRoute} from "@angular/router";
import {ActivityRatingComponent} from "../activity-rating/activity-rating.component";
import {ELocalNotificationTriggerUnit, LocalNotifications} from '@ionic-native/local-notifications/ngx';
// import {File} from "@ionic-native/file/ngx"; ak budeme chciet k sharovanie prilozit aj obrazok
import {SocialSharing} from "@ionic-native/social-sharing/ngx";
import {UserService} from "../../../services/user.service";
import {ActivityUpdateComponent} from "../activity-update/activity-update.component";


@Component({
    selector: 'app-activity-detail',
    templateUrl: './activity-detail.component.html',
    styleUrls: ['./activity-detail.component.scss'],
})
export class ActivityDetailComponent implements OnInit, AfterViewInit {
    map;
    activity: Activity[];
    validations_form: FormGroup;
    sport2: any;
    user: any = {};
    time: any;
    timeMinutes: any;
    @Input() selectedActivity: Activity;
    @Input() bookable: boolean;
    @Input() reserved: boolean;
    @Input() overdue: boolean;
    @Input() unSigned: boolean;

    //total kalendar
    year:any;
    date:any;
    day:any;
    month:any;
    hours:any
    minutes:any;

    userFromTable:any={}

    sportOptions: Sport[] = [];
    private objekt: any;
    initialMapLoad = true;
    private lattitudeFirebase: string;
    private longtitudeFirebase: string;
    sportId55 = null;
    constructor(
        public toastController: ToastController,
        private nativeGeocoder: NativeGeocoder,
        private modalController: ModalController,
        private fb: FormBuilder,
        private userService: UserService,
        private activityService: ActivityService,
        private dataService: DataService,
        private authService: AuthService,
        public zone: NgZone,
        private route: ActivatedRoute,
        private plt: Platform,
        private localNotification: LocalNotifications,
        private socialSharing: SocialSharing,
        public alertController: AlertController
    ) {
        if (this.dataService)
        // @ts-ignore
        this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
        this.autocomplete = {input: ''};
        this.autocompleteItems = [];
        const positionFeature = new Feature();
        this.plt.ready().then(()=> {
            this.localNotification.on('click').subscribe(res=> {
            console.log('click', res);
            let msg = res.data ? res.data.mydata :'';

            });
            this.localNotification.on('trigger').subscribe(res=> {
                console.log('trigger', res);
            });
        })

    }


    activityForm = this.fb.group({
        peopleCount: ['', Validators.required],
        place: ['', Validators.required],
        topActivity: [false],
        date: ['', Validators.required],
        sport: ['', Validators.required],
        comment: [''],
        time: [''],
        latitude: [''],
        longtitude: ['']
    });
    // @ts-ignore
    GoogleAutocomplete: google.maps.places.AutocompleteService;
    autocomplete: { input: string; };
    autocompleteItems: any[];
    location: any;
    placeid: any;
    // @ts-ignore
    compareWith = this.compareWithFn;





    ngOnInit() {

        this.activityService.getActivity().subscribe(res => {
            this.sport2 =res;
        });



        console.log(this.selectedActivity);
        this.sportOptions = this.dataService.getSportsSk();
        this.assignValueToForm();


        if (!this.overdue) {
            if (this.bookable) {
                this.activityForm.disable();
            } else if (!this.bookable) {
                this.activityForm.enable();
            } else if (this.reserved) {
                this.activityForm.disable();
            }
        }
        else this.activityForm.disable();
        this.time = new Date(this.selectedActivity.date).toLocaleString();
        this.timeMinutes =  new Date(this.selectedActivity.date).getMinutes();

        this.userService.getOneUser(this.selectedActivity.createdBy).subscribe(res=>{ //pokial by sme chceli fotku tvorcu
            this.userFromTable = res;
        });

        var mesiace = ["Jan","Feb", "Mar", "Apr","Maj","Jun","Jul","Aug","Sep","Okt","Nov","Dec"];
        var dni = ["Nedeľa","Pondelok","Utorok","Streda","Štvrtok","Piatok","Sobota"];
        this.year = new Date(this.selectedActivity.date).getFullYear();
        this.date = new Date(this.selectedActivity.date).getDate();
        this.day = dni[new Date(this.selectedActivity.date).getDay()];
        this.month = mesiace[new Date(this.selectedActivity.date).getMonth()];
        this.hours = new Date(this.selectedActivity.date).getHours();
        this.minutes = new Date(this.selectedActivity.date).getMinutes();
        console.log('this is datumik:' + this.day,this.month, this.hours, this.minutes);

    }
    // getData(){
    //     this.route.data.subscribe(routeData => {
    //         let data = routeData['data'];
    //         if (data) {
    //             this.sport2 = data;
    //         }
    //     });
    // }

    onCancel() {
        this.modalController.dismiss({message: 'ActivityDetail closed'}, 'cancel');
    }

    compareWithFn = (o1, o2) => {
        return o1 == o2;
    }

    assignValueToForm() {
        this.activityForm.get('peopleCount').patchValue(this.selectedActivity.peopleCount);
        this.activityForm.get('place').patchValue(this.selectedActivity.place);
        this.activityForm.get('topActivity').patchValue(this.selectedActivity.topActivity);
        // this.activityForm.get('date').patchValue(new Date(this.selectedActivity.date).toISOString());
        this.activityForm.get('date').patchValue(new Date(this.selectedActivity.date).toDateString());
        this.activityForm.get('sport').setValue(this.selectedActivity.sport);
        this.activityForm.get('comment').patchValue(this.selectedActivity.comment);
        // this.activityForm.get('time').patchValue(this.selectedActivity.time);
        this.activityForm.get('time').patchValue(new Date(this.selectedActivity.date).toString());

        this.autocomplete.input = this.selectedActivity.place;

        this.activityForm.updateValueAndValidity();
        console.log(this.activityForm.value);
    }

    onFormSubmit() {
        if (!this.bookable && !this.reserved) {
            this.updateActivity();
            // this.activityService.updateActivity(this.selectedActivity, this.assignValueToActivity()).then(()=>{
            //     this.dataService.refreshAfterLogin = true;
            // });

        } else if (this.bookable && !this.reserved) {
            this.activityService.addBookerToActivity(this.selectedActivity).then(()=>{
                this.dataService.refreshAfterLogin = true;
            });
            this.scheduleNotification();
        }
        else if (this.reserved) {
            this.activityService.removeBookerFromActivity(this.selectedActivity).then(()=>{
                this.dataService.refreshAfterLogin = true;
            });
            console.log("som pri prvom resrvede");
        }
        else if (!this.reserved) {  //toto asi netreba
            this.activityService.deleteActivity(this.selectedActivity).then(()=>{
                this.dataService.refreshAfterLogin = true;
            });
            console.log("som pri druhom resrvede");

        }
        const data = {message: 'Add new activity!'};
        if (this.bookable) {
            console.log(this.selectedActivity.id);
            console.log(this.authService.userIdAuth);
            data.message = 'Booked activity';


        }
        console.log(this.selectedActivity.id);
        console.log(this.authService.userIdAuth);
        this.modalController.dismiss(data, 'add');
    }
    onFormSubmitDelete() {

        if (!this.reserved) {
            this.activityService.deleteActivity(this.selectedActivity).then(()=>{
                this.dataService.refreshAfterLogin = true;
            });
            console.log("deletujem");
        }

        const data = {message: 'Add new activity!'};
        if (this.bookable) {
            this.dataService.refreshAfterLogin = true;
            console.log(this.selectedActivity.id);
            console.log(this.authService.userIdAuth);
            data.message = 'Booked activity';


        }
        console.log(this.selectedActivity.id);
        console.log(this.authService.userIdAuth);
        this.modalController.dismiss(data, 'add');
    }

    assignValueToActivity(): Activity {
        let lattitude = this.selectedActivity.lattitude;
        let longitude = this.selectedActivity.longtitude;
        if (this.lattitudeFirebase != undefined){
            lattitude = this.lattitudeFirebase;
            longitude = this.longtitudeFirebase;
        }
        var cas = new Date(this.activityForm.get('time').value);

        var datum =  new Date(this.activityForm.get('date').value); // toto robimlen preto aby som k datumu pridal rovno cas
        datum.setHours(cas.getHours());                            // a potom ho rovno pri zobrazeni menil na timestamp
        datum.setMinutes(cas.getMinutes());
        return {
            // id: this.activityService.allActivitiesCount + 1,
            sport: this.activityForm.get('sport').value,
            createdBy: this.dataService.getSignInUser().id,
            topActivity: this.activityForm.get('topActivity').value,
            place: this.activityForm.get('place').value,
            peopleCount: this.activityForm.get('peopleCount').value,
            date: datum.getTime(),
            comment: this.activityForm.get('comment').value,
            // time: this.activityForm.get('time').value,
            bookedBy: this.selectedActivity.bookedBy,
            lattitude: lattitude,
            longtitude: longitude,
        };
    }

    updateSearchResults() {
        if (this.autocomplete.input === '') {
            this.autocompleteItems = [];
            return;
        }
        this.GoogleAutocomplete.getPlacePredictions({input: this.autocomplete.input},
            (predictions, status) => {
                this.autocompleteItems = [];
                this.zone.run(() => {
                    predictions.forEach((prediction) => {
                        this.autocompleteItems.push(prediction);
                    });
                });
            });
    }

    selectSearchResult(item) {
        // let place: google.maps.places.PlaceResult = this.GoogleAutocomplete.getPlacePredictions();
        console.log(item);
        this.location = item;
        this.placeid = this.location.place_id;
        console.log(this.placeid);
        JSON.stringify(item);   // tu potrebujem priradit vyber mesta po kliknuti, v iteme je object a ja potrebujem item.description
        this.autocomplete.input = JSON.stringify(item, ['description']);
        this.objekt = JSON.parse(this.autocomplete.input);
        this.autocomplete.input = this.objekt.description;
        console.log('toto je mesto omg' + this.autocomplete.input);
        for (let i = 0; i < 6; i++) {
            this.autocompleteItems.pop();
        }
        const options: NativeGeocoderOptions = {
            useLocale: true,
            maxResults: 5
        };
        this.nativeGeocoder.forwardGeocode(this.autocomplete.input, options)
            .then((result: NativeGeocoderResult[]) => console.log('The coordinates are latitude=' +
                result[0].latitude + ' and longitude=' + result[0].longitude)) // tu je sirka a vyska
            .catch((error: any) => console.log('nejdze'));

        this.nativeGeocoder.forwardGeocode(this.autocomplete.input, options)
            .then((result: NativeGeocoderResult[]) =>
                this.lattitudeFirebase = result[0].latitude) // tu je sirka a vyska
            .catch((error: any) => this.openToast('Toto sa dosralo'));

        this.nativeGeocoder.forwardGeocode(this.autocomplete.input, options)
            .then((result: NativeGeocoderResult[]) =>
                this.longtitudeFirebase = result[0].longitude) // tu je sirka a vyska
            .catch((error: any) => this.openToast('Toto sa dosralo'));

        console.log('kurwa co to nejde');
    }
    async openToast(msg) {
        const toast = await  this.toastController.create({
            message: msg , duration: 2000
        });
        toast.present();
    }





    ngAfterViewInit(): void {
        var iconStyle = new Style({
            image: new CircleStyle({
                radius: 8,
                stroke: new Stroke({
                    color: '#fff'
                }),
                fill: new Fill({
                    color: '#ff0000'
                })
            })
        });
        new VectorLayer({
            map: this.map = new Map({
                layers: [
                    new TileLayer({
                        source: new OSM()
                    })],
                target: document.getElementById('map2'),
                view: new View({
                    center: fromLonLat([this.selectedActivity.longtitude, this.selectedActivity.lattitude]),
                    zoom: 13
                }),
            }),
            source: new VectorSource({
                features: [new Feature({
                    geometry: new Point(fromLonLat([this.selectedActivity.longtitude, this.selectedActivity.lattitude])),

                }) ]
            }),
            style: iconStyle
        });
        setTimeout(() => {
            this.map.updateSize();
        }, 500);
        console.log('mapa idze ci nejdze');
    }

    updateActivity(){
        this.modalController
            .create({component: ActivityUpdateComponent,
                componentProps:{
                    selectedActivity: this.selectedActivity
                }

            })
            .then(modalEl => {
                console.log("som v tabe 1111  hore");
                modalEl.present();
                return modalEl.onDidDismiss();
            })
            .then(result => {

            });
    }


    rateUsers(){
        this.modalController
            .create({component: ActivityRatingComponent,
                componentProps:{
                    idAktivity: this.selectedActivity.id,
                    users: this.selectedActivity.bookedByNames,
                    usersId: this.selectedActivity.bookedBy,
                    overdue: this.overdue,
                    profile: false,
                    idSportu: this.selectedActivity.sport,
                    createdBy: this.selectedActivity.createdBy
                }

            })
            .then(modalEl => {
                console.log("som v tabe 1111  hore");
                modalEl.present();
                return modalEl.onDidDismiss();
            })
            .then(result => {

            });
    }
    scheduleNotification(){
        var minusOneHour = this.selectedActivity.date - (3600*1000); // lebo timestamp mame in da miliseconds, preto * 1000
        this.localNotification.schedule({
            id: this.selectedActivity.date, // tu by som chcel dat id aktivity, ale firebase ma aj string v idcku..to je na ric,,zatim taketo trapne riesenie
            title: this.dataService.getSportNameByValue(Number(this.selectedActivity.sport)),
            text: new Date(this.selectedActivity.date).getHours()+ ':' + new Date(this.selectedActivity.date).getMinutes() +'\n'+this.selectedActivity.place,
            trigger: {at: new Date(minusOneHour)}, // hodinu pred aktivitou chceme notifikaciu
            foreground: true
        });
    }

    async presentAlertConfirm(header:string, message:string, ano:string, vymazat:boolean) {
    const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: header,
        message: message,
        buttons: [
            {
                text: 'Zrušiť',
                role: 'cancel',
                cssClass: 'secondary',
                handler: (blah) => {

                }
            }, {
                text: ano,
                handler: () => {
                    if (!vymazat){
                        this.onFormSubmit();
                    }
                    else{
                        this.onFormSubmitDelete()
                    }
                }
            }
        ]
    });

    await alert.present();
}

      facebookShare(){
        //tu bude url nasej appky v obchode playyy
        var url = 'https://i.guim.co.uk/img/media/0e5ba031e776c312d744077a9aa1467815849e42/923_166_2287_1372/master/2287.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=b723b8f70c073e45b0c5cddbc6e5cade';

          this.socialSharing.canShareVia('facebook').then(() => {

              this.socialSharing.shareVia('facebook','SportFriend: ' + this.selectedActivity.peopleCount + ' ludi, ' +
                  this.selectedActivity.place,null,null, 'https://www.google.sk')
                  .then((success) =>{

                  })
                  .catch((e)=>{

                  });
          }).catch(()=>{
              this.openToast("Nepodarilo sa nacitat aplikaciu facebook");
          })


      }

    instagramShare(){
        this.socialSharing.canShareVia('instagram').then(() => {

            this.socialSharing.shareVia('instagram','SportFriend: ' + this.selectedActivity.peopleCount + ' ludi, ' +
                this.selectedActivity.place,null,null, 'https://www.google.sk')
                .then((success) =>{
                })
                .catch((e)=>{
                });
        }).catch((error: any)=>{
            this.openToast("Nepodarilo sa nacitat aplikaciu instagram" + error);
            console.log(error)
        })
    }

}

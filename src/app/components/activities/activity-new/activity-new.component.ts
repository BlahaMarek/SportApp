import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ModalController, Platform} from '@ionic/angular';
import {ActivityService} from '../../../services/activity.service';
import {Activity} from '../../../models/activity';
import {DataService} from '../../../data/data.service';
import {Sport} from '../../../models/sport';
import {AuthService} from '../../../auth/auth.service';
import {ELocalNotificationTriggerUnit, LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {NativeGeocoderOptions, NativeGeocoderResult} from '@ionic-native/native-geocoder';
import {NativeGeocoder} from '@ionic-native/native-geocoder/ngx';
import { ToastController} from '@ionic/angular';
import {FirestoreService} from '../../../services/firestore.service';
import * as firebase from "firebase";
import {EventService} from "../../../services/event.service";
import {IonicSelectableComponent} from "ionic-selectable";

@Component({
    selector: 'app-activity-new',
    templateUrl: './activity-new.component.html',
    styleUrls: ['./activity-new.component.scss'],
})
export class ActivityNewComponent implements OnInit {
    sportOptions: Sport[] = [];
    aktivitaOrEvent = ['Aktivita','Udalost'];
    private objekt: any;
    lat: number;
    longt: number;
    lattitudeFirebase: string;
    longtitudeFirebase: string;
    startDate: any;
    minDate: any;
    maxDate: any;
    year: string;
    user: any = {};
    internet:boolean;
    sport: Sport;
    constructor(
        private fireService: FirestoreService,
        public toastController: ToastController,
        private nativeGeocoder: NativeGeocoder,
        private fb: FormBuilder,
        private modalController: ModalController,
        private activityService: ActivityService,
        private dataService: DataService,
        private authService: AuthService,
        public zone: NgZone,
        private plt: Platform,
        private localNotification: LocalNotifications,
        private eventService: EventService
    ) {
        this.aktivitaOrEvent;
        this.sportOptions = this.dataService.getSportsSk();
        // @ts-ignore
        this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
        this.autocomplete = {input: ''};
        this.autocompleteItems = [];
    }

    // @ts-ignore
    GoogleAutocomplete: google.maps.places.AutocompleteService;
    autocomplete: { input: string; };
    autocompleteItems: any[];
    userIdFire: string;
    location: any;
    placeid: any;
    activityForm = this.fb.group({
        what: ['', Validators.required],
        peopleCount: ['', Validators.required],
        place: ['', Validators.required],
        topActivity: [false],
        date: ['', Validators.required],
        time: ['', Validators.required],
        sport: ['', Validators.required],
        comment: [''],
        lattitudeFB: [''],
        longtitudeFB: [''],
    });

    ngOnInit() {
        this.user = this.dataService.getSignInUser();
        this.startDate = new Date().toISOString();
        this.minDate = new Date().toISOString();

        this.dataService.internet$.subscribe(int=>{
            this.internet = int;
        })

    }


    portChange(event: {
        component: IonicSelectableComponent,
        value: any
    }) {
        // this.fb.control('sport').setValue(event.value.value);
        console.log(event.value.value);
        console.log(this.activityForm.get('sport').value.value);
    }

    onCancel() {
        this.modalController.dismiss({message: 'Close new activity!'}, 'cancel');
    }

    onFormSubmit() {
        if (this.activityForm.get('what').value == "Aktivita"){
            this.activityService.addActivity(this.assignValueToActivity());
            this.fireService.createSport(this.assignValueToActivity());
            this.scheduleNotification(); //notifikaciaaa
            this.modalController.dismiss({message: 'Add new activity!'}, 'add');
        }else {
            this.eventService.addEvent(this.assignValueToActivity());
            this.fireService.createEvent(this.assignValueToActivity());
            this.scheduleNotification(); //notifikaciaaa
            this.modalController.dismiss({message: 'Add new event!'}, 'add');
        }

    }

    assignValueToActivity(): Activity {
        var cas = new Date(this.activityForm.get('time').value);
        cas.setSeconds(0);
        var datum =  new Date(this.activityForm.get('date').value); // toto robimlen preto aby som k datumu pridal rovno cas
        datum.setHours(cas.getHours());                            // a potom ho rovno pri zobrazeni menil na timestamp
        datum.setMinutes(cas.getMinutes());
        datum.setSeconds(cas.getSeconds());
        console.log(cas.getSeconds())
        console.log(datum)
        var datum2 = datum.getTime();
        return {
            // id: this.activityService.allActivitiesCount + 1,

            sport: this.activityForm.get('sport').value.value,
            createdBy: this.user.id,
            topActivity: this.activityForm.get('topActivity').value,
            place: this.activityForm.get('place').value,
            peopleCount: this.activityForm.get('peopleCount').value,
            date: datum.getTime(),
            // time: this.activityForm.get('time').value,
            comment: this.activityForm.get('comment').value,
            bookedBy: [],
            bookedByNames:[],
            lattitude : this.lattitudeFirebase,
            longtitude: this.longtitudeFirebase

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
        //console.log(item);
        this.location = item;
        this.placeid = this.location.place_id;
        //console.log(this.placeid);
        JSON.stringify(item);   // tu potrebujem priradit vyber mesta po kliknuti, v iteme je object a ja potrebujem item.description
        this.autocomplete.input = JSON.stringify(item, ['description']);
        this.objekt = JSON.parse(this.autocomplete.input);
        this.autocomplete.input = this.objekt.description;
        //console.log('toto je mesto omg' + this.autocomplete.input);
        for (let i = 0; i < 6; i++) {
            this.autocompleteItems.pop();
        }
        const options: NativeGeocoderOptions = {
            useLocale: true,
            maxResults: 5
        };
        this.nativeGeocoder.forwardGeocode(this.autocomplete.input, options)
            .then((result: NativeGeocoderResult[]) =>
                this.openToast("Miesto najdene na mape")) // tu je sirka a vyska
            .catch((error: any) => this.openToast('Nepodarilo sa vybrat miesto'));

        this.nativeGeocoder.forwardGeocode(this.autocomplete.input, options)
            .then((result: NativeGeocoderResult[]) =>
                    this.lattitudeFirebase = result[0].latitude) // tu je sirka a vyska
            .catch((error: any) => this.openToast('Toto sa dosralo'));

        this.nativeGeocoder.forwardGeocode(this.autocomplete.input, options)
            .then((result: NativeGeocoderResult[]) =>
                this.longtitudeFirebase = result[0].longitude) // tu je sirka a vyska
            .catch((error: any) => this.openToast('Toto sa dosralo'));

        //console.log('kurwa co to nejde');
        // this.nativeGeocoder.reverseGeocode(52.5072095, 13.1452818, options)
        //     .then((result: NativeGeocoderReverseResult[]) => console.log(JSON.stringify(result[0])))
        //     .catch((error: any) => console.log(error));
    }
    async openToast(msg) {
        const toast = await  this.toastController.create({
            message: msg , duration: 2000
        });
        toast.present();
    }
    scheduleNotification(){
        //TODO: upravit idcka na nieco rozumne..musi to byt number ...aj v detaile
        var minusOneHour = this.assignValueToActivity().date - (3600*1000); // lebo timestamp mame in da miliseconds, preto * 1000
        this.localNotification.schedule({
            id: 2,
            title: this.dataService.getSportNameByValue(Number(this.assignValueToActivity().sport)),
            text: new Date(this.assignValueToActivity().date).getHours()+ ':' + new Date(this.assignValueToActivity().date).getMinutes() +'\n'+
                this.assignValueToActivity().place,
            trigger: {at: new Date(minusOneHour)}, // hodinu pred aktivitou chceme notifikaciu
            foreground: true
        });
    }
}

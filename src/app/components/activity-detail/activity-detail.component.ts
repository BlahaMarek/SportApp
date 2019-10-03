import {AfterContentInit, Component, Input, NgZone, OnInit, ViewChild} from '@angular/core';
import {Activity} from '../../models/activity';
import {ModalController} from '@ionic/angular';
import {FormBuilder, Validators} from '@angular/forms';
import {Sport} from '../../models/sport';
import {DataService} from '../../data/data.service';
import {ActivityService} from '../../services/activity.service';
import {AuthService} from '../../auth/auth.service';
import {NativeGeocoderOptions, NativeGeocoderResult} from '@ionic-native/native-geocoder';
import {NativeGeocoder} from '@ionic-native/native-geocoder/ngx';
import { ToastController} from '@ionic/angular';

declare var google;
let position;
let marker;

@Component({
    selector: 'app-activity-detail',
    templateUrl: './activity-detail.component.html',
    styleUrls: ['./activity-detail.component.scss'],
})
export class ActivityDetailComponent implements OnInit, AfterContentInit {
    map;
    // @ts-ignore
    @ViewChild('mapElement') mapElement;
    @Input() selectedActivity: Activity;
    @Input() bookable: boolean;
    sportOptions: Sport[] = [];
    private objekt: any;

    constructor(
        public toastController: ToastController,
        private nativeGeocoder: NativeGeocoder,
        private modalController: ModalController,
        private fb: FormBuilder,
        private activityService: ActivityService,
        private dataService: DataService,
        private authService: AuthService,
        public zone: NgZone
    ) {
        // @ts-ignore
        this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
        this.autocomplete = {input: ''};
        this.autocompleteItems = [];
    }


    activityForm = this.fb.group({
        peopleCount: ['', Validators.required],
        place: ['', Validators.required],
        topActivity: [false],
        date: ['', Validators.required],
        sport: ['', Validators.required]
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
        this.sportOptions = this.dataService.getSportsSk();
        this.assignValueToForm();

        if (this.bookable) {
            this.activityForm.disable();
        } else {
            this.activityForm.enable();
        }
    }

    onCancel() {
        this.modalController.dismiss({message: 'ActivityDetail closed'}, 'cancel');
    }

    compareWithFn = (o1, o2) => {
        return o1.value == o2.value;
    };

    assignValueToForm() {
        this.activityForm.get('peopleCount').patchValue(this.selectedActivity.peopleCount);
        this.activityForm.get('place').setValue(this.selectedActivity.place);
        this.activityForm.get('topActivity').patchValue(this.selectedActivity.topActivity);
        this.activityForm.get('date').patchValue(new Date(this.selectedActivity.date).toISOString());
        this.activityForm.get('sport').setValue(this.selectedActivity.sport);
        this.activityForm.updateValueAndValidity();
    }

    onFormSubmit() {
        if (!this.bookable) {
            this.activityService.updateActivity(this.selectedActivity.id ,this.assignValueToActivity());
        } else {
            this.activityService.addBookerToActivity(this.selectedActivity.id, this.authService.userIdAuth);
        }
        let data = {message: 'Add new activity!'};
        if (this.bookable) {
            data.message = "Booked activity";
        }
        this.modalController.dismiss(data, 'add');
    }

    assignValueToActivity(): Activity {
        return {
            id: this.activityService.allActivitiesCount + 1,
            sport: this.activityForm.get('sport').value,
            createdBy: this.authService.userIdAuth,
            topActivity: this.activityForm.get('topActivity').value,
            place: this.activityForm.get('place').value,
            peopleCount: this.activityForm.get('peopleCount').value,
            date: this.activityForm.get('date').value,
            bookedBy: this.selectedActivity.bookedBy
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
                result[0].latitude + ' and longitude=' +  result[0].longitude)) // tu je sirka a vyska
            .catch((error: any) => console.log('nejdze'));

        console.log('kurwa co to nejde');
        // this.nativeGeocoder.reverseGeocode(52.5072095, 13.1452818, options)
        //     .then((result: NativeGeocoderReverseResult[]) => console.log(JSON.stringify(result[0])))
        //     .catch((error: any) => console.log(error));
    }

    ngAfterContentInit(): void {
        this.map = new google.maps.Map(
            this.mapElement.nativeElement,
            {
                center: {lat: 48.6980985, lng: 21.2340841}, // tu pojde pozicia z firebasu tiez
                zoom: 12
            });
        this.addMarkersToMap();
    }
    addMarkersToMap() {
         position = new google.maps.LatLng(48.6980985, 21.2340841); // tu pojde pozicia z firebasu
         marker = new google.maps.Marker({ position, title: 'Here' });
         marker.setMap(this.map);
    }
}

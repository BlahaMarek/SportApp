import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ElementRef,
    Inject,
    Input,
    NgZone,
    OnInit,
    ViewChild
} from '@angular/core';
import {Activity} from '../../../models/activity';
import {ModalController} from '@ionic/angular';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Sport} from '../../../models/sport';
import {DataService} from '../../../data/data.service';
import {ActivityService} from '../../../services/activity.service';
import {AuthService} from '../../../auth/auth.service';
import {NativeGeocoderOptions, NativeGeocoderResult} from '@ionic-native/native-geocoder';
import {NativeGeocoder} from '@ionic-native/native-geocoder/ngx';
import { ToastController} from '@ionic/angular';
import {source} from '@angular-devkit/schematics';
import 'ol/ol.css';
import Feature from 'ol/Feature';
import {fromLonLat} from 'ol/proj';
import Map from 'ol/Map';
import View from 'ol/View';
import Point from 'ol/geom/Point';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Circle as CircleStyle, Fill, Stroke, Style, Icon} from 'ol/style';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {ActivatedRoute} from "@angular/router";


const positionFeature = new Feature();


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

    @Input() selectedActivity: Activity;
    @Input() bookable: boolean;
    @Input() reserved: boolean;
    @Input() overdue: boolean;
    @Input() unSigned: boolean;


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
        private activityService: ActivityService,
        private dataService: DataService,
        private authService: AuthService,
        public zone: NgZone,
        private route: ActivatedRoute
    ) {
        if (this.dataService)
        // @ts-ignore
        this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
        this.autocomplete = {input: ''};
        this.autocompleteItems = [];
        const positionFeature = new Feature();

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
        this.activityForm.get('date').patchValue(new Date(this.selectedActivity.date).toISOString());
        this.activityForm.get('sport').setValue(this.selectedActivity.sport);
        this.activityForm.get('comment').patchValue(this.selectedActivity.comment);
        this.activityForm.get('time').patchValue(this.selectedActivity.time);


        this.activityForm.updateValueAndValidity();
        console.log(this.activityForm.value);
    }

    onFormSubmit() {
        if (!this.bookable && !this.reserved) {
            this.activityService.updateActivity(this.selectedActivity, this.assignValueToActivity()).then(()=>{
                this.dataService.refreshAfterLogin = true;

            });
            console.log("upravujem aktivitu");
        } else if (this.bookable && !this.reserved) {
            this.activityService.addBookerToActivity(this.selectedActivity).then(()=>{
                this.dataService.refreshAfterLogin = true;
            });
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
        return {
            // id: this.activityService.allActivitiesCount + 1,
            sport: this.activityForm.get('sport').value,
            createdBy: this.authService.userIdAuth,
            topActivity: this.activityForm.get('topActivity').value,
            place: this.activityForm.get('place').value,
            peopleCount: this.activityForm.get('peopleCount').value,
            date: this.activityForm.get('date').value,
            comment: this.activityForm.get('comment').value,
            time: this.activityForm.get('time').value,
            bookedBy: this.selectedActivity.bookedBy,
            lattitude: this.lattitudeFirebase,
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
}

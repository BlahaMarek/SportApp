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
import {Activity} from '../../models/activity';
import {ModalController} from '@ionic/angular';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Sport} from '../../models/sport';
import {DataService} from '../../data/data.service';
import {ActivityService} from '../../services/activity.service';
import {AuthService} from '../../auth/auth.service';
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
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
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
        // tslint:disable-next-line:no-shadowed-variable
        const positionFeature = new Feature();
        positionFeature.setStyle(new Style({
            image: new CircleStyle({
                radius: 6,
                fill: new Fill({
                    color: '#3399CC'
                }),
                stroke: new Stroke({
                    color: '#fff',
                    width: 2
                })
            })
        }));
    }


    activityForm = this.fb.group({
        peopleCount: ['', Validators.required],
        place: ['', Validators.required],
        topActivity: [false],
        date: ['', Validators.required],
        sport: ['', Validators.required],
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
        })



        console.log(this.selectedActivity);
        this.sportOptions = this.dataService.getSportsSk();
        this.assignValueToForm();

        if (this.bookable) {
            this.activityForm.disable();
        } else {
            this.activityForm.enable();
        }
    }
    getData(){
        this.route.data.subscribe(routeData => {
            let data = routeData['data'];
            if (data) {
                this.sport2 = data;
            }
        });
    }

    onCancel() {
        this.modalController.dismiss({message: 'ActivityDetail closed'}, 'cancel');
    }

    compareWithFn = (o1, o2) => {
        return o1.value === o2.value;
    }

    assignValueToForm() {
        this.activityForm.get('peopleCount').patchValue(this.selectedActivity.peopleCount);
        this.activityForm.get('place').setValue(this.selectedActivity.place);
        this.activityForm.get('topActivity').patchValue(this.selectedActivity.topActivity);
        this.activityForm.get('date').patchValue(new Date(this.selectedActivity.date).toISOString());
        this.activityForm.get('sport').setValue(this.selectedActivity.sport);
        this.activityForm.updateValueAndValidity();
        console.log(this.activityForm.value);
    }

    onFormSubmit() {
        if (!this.bookable) {
            this.activityService.updateActivity(this.selectedActivity.id, this.assignValueToActivity());
        } else {
            this.activityService.addBookerToActivity(this.selectedActivity).then(()=>{
                console.log("Tymto logom som nezisil nic");
            });
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

    assignValueToActivity(): Activity {
        return {
            // id: this.activityService.allActivitiesCount + 1,
            id: "thiactivi",
            sport: this.activityForm.get('sport').value,
            createdBy: this.authService.userIdAuth,
            topActivity: this.activityForm.get('topActivity').value,
            place: this.activityForm.get('place').value,
            peopleCount: this.activityForm.get('peopleCount').value,
            date: this.activityForm.get('date').value,
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
        // tslint:disable-next-line:no-unused-expression
        new VectorLayer({
            map: this.map = new Map({
                layers: [
                    new TileLayer({
                        source: new OSM()
                    })],
                target: document.getElementById('map2'),
                view: new View({
                    center: fromLonLat([21.23408, 48.69809]),
                    zoom: 13
                }),
            }),
            source: new VectorSource({
                features: [new Feature({
                    geometry: new Point(fromLonLat([21.23408, 48.69809])) // tu pojdu vsetky aktivity
                }), positionFeature]
            })
        });
        setTimeout(() => {
            this.map.updateSize();
        }, 500);
        console.log('mapa idze ci nejdze');
    }
}

import {Component, NgZone, OnInit} from '@angular/core';
import {Sport} from "../../../models/sport";
import {FirestoreService} from "../../../services/firestore.service";
import {ModalController, ToastController} from "@ionic/angular";
import {NativeGeocoder} from "@ionic-native/native-geocoder/ngx";
import {FormBuilder, Validators} from "@angular/forms";
import {ActivityService} from "../../../services/activity.service";
import {DataService} from "../../../data/data.service";
import {AuthService} from "../../../auth/auth.service";
import * as firebase from "firebase";
import {Activity} from "../../../models/activity";
import {NativeGeocoderOptions, NativeGeocoderResult} from "@ionic-native/native-geocoder";
import {EventService} from "../../../services/event.service";

@Component({
  selector: 'app-event-new',
  templateUrl: './event-new.component.html',
  styleUrls: ['./event-new.component.scss'],
})
export class EventNewComponent implements OnInit {

  sportOptions: Sport[] = [];
  private objekt: any;
  lat: number;
  longt: number;
  lattitudeFirebase: string;
  longtitudeFirebase: string;
  startDate: any;
  minDate: any;
  maxDate: any;
  year: string;
  constructor(
      private fireService: FirestoreService,
      public toastController: ToastController,
      private nativeGeocoder: NativeGeocoder,
      private fb: FormBuilder,
      private modalController: ModalController,
      private eventService: EventService,
      private dataService: DataService,
      private authService: AuthService,
      public zone: NgZone,
  ) {
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
    peopleCount: 0,
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
    firebase.auth().onAuthStateChanged((user)=>{
      if (user){
        console.log(user.uid);
        this.userIdFire = user.uid;
      }
      else {
        console.log("Nepodarilo sa nacitat uid usera");
        this.userIdFire = "xxx"; //totot dat prec
      }
    });
    this.startDate = new Date().toISOString();


    this.minDate = new Date().toISOString();


  }

  onCancel() {
    this.modalController.dismiss({message: 'Close new activity!'}, 'cancel');
  }

  onFormSubmit() {
    firebase.auth().onAuthStateChanged((user)=>{
      if (user){
        console.log(user.uid);
        this.userIdFire = user.uid;
      }
      else {
        console.log("Nepodarilo sa nacitat uid usera");
      }
    });
    this.eventService.addEvent(this.assignValueToActivity());
    this.fireService.createEvent(this.assignValueToActivity());
    this.modalController.dismiss({message: 'Add new activity!'}, 'add');
  }

  assignValueToActivity(): Activity {
    var cas = new Date(this.activityForm.get('time').value);

    console.log("toto je acs ktory chcem ulozit do datu" + cas.getHours());
    console.log("toto je acs ktory chcem ulozit do datu" + cas.getMinutes());

    var datum =  new Date(this.activityForm.get('date').value); // toto robimlen preto aby som k datumu pridal rovno cas
    datum.setHours(cas.getHours());                            // a potom ho rovno pri zobrazeni menil na timestamp
    datum.setMinutes(cas.getMinutes());
    console.log("totot je timestamp vytorenej aktivity:" + datum.getTime())// a starsie aktivity sa nebudu zobrazovat, pro
    console.log("toto je terajsi casik, pro"+new Date().getTime());
    var datum2 = datum.toString();
    return {
      // id: this.activityService.allActivitiesCount + 1,

      sport: this.activityForm.get('sport').value,
      createdBy: this.userIdFire,
      topActivity: this.activityForm.get('topActivity').value,
      place: this.activityForm.get('place').value,
      peopleCount: this.activityForm.get('peopleCount').value,
      date: datum2,
      time: this.activityForm.get('time').value,
      comment: this.activityForm.get('comment').value,
      bookedBy: [],
      lattitude : "18",
      longtitude: "14"

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
            this.openToast('The coordinates are latitude=' +
                result[0].latitude + ' and longitude=' +  result[0].longitude)) // tu je sirka a vyska
        .catch((error: any) => this.openToast('Toto sa dosralo'));

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
}

import {Component, Input, NgZone, OnInit} from '@angular/core';
import {ModalController, ToastController} from "@ionic/angular";
import {FormBuilder, Validators} from "@angular/forms";
import {Sport} from "../../../models/sport";
import {DataService} from "../../../data/data.service";
import {NativeGeocoderOptions, NativeGeocoderResult} from "@ionic-native/native-geocoder";
import {NativeGeocoder} from "@ionic-native/native-geocoder/ngx";
import {Activity} from "../../../models/activity";
import {ActivityService} from "../../../services/activity.service";
import {EventService} from "../../../services/event.service";

@Component({
  selector: 'app-activity-update',
  templateUrl: './activity-update.component.html',
  styleUrls: ['./activity-update.component.scss'],
})
export class ActivityUpdateComponent implements OnInit {
@Input() selectedActivity;
  @Input() fromEvent;


  private lattitudeFirebase: string;
  private longtitudeFirebase: string;
  sportOptions: Sport[] = [];
  private objekt: any;
  constructor(
      private modalController: ModalController,
      private fb: FormBuilder,
      private nativeGeocoder: NativeGeocoder,
      private dataService: DataService,
      public zone: NgZone,
      private eventService: EventService,
      private activityService: ActivityService,
      public toastController: ToastController) {
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
    console.log(this.selectedActivity);
    this.sportOptions = this.dataService.getSportsSk();
    this.assignValueToForm();
  }

  compareWithFn = (o1, o2) => {
    return o1 == o2;
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

  onCancel() {
    this.modalController.dismiss({message: 'ActivityDetail closed'}, 'cancel');
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

  updateAktivity(){
    this.activityService.updateActivity(this.selectedActivity, this.assignValueToActivity()).then(()=>{

    });
    this.modalController.dismiss({message: 'ActivityUpdate closed'}, 'cancel');
  }
  updateEvent(){
    this.eventService.updateActivity(this.selectedActivity, this.assignValueToActivity()).then(()=>{
    });
    this.modalController.dismiss({message: 'ActivityUpdate closed'}, 'cancel');
  }

}

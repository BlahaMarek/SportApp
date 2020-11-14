import {Component, EventEmitter, OnInit, Output, ViewChild, ViewChildren} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Sport} from "../../models/sport";
import {DataService} from "../../data/data.service";
import { DatePicker } from '@ionic-native/date-picker/ngx';
import {Platform, ToastController} from '@ionic/angular';
import {SlideInOutAnimation} from '../../animations/filterAnimation';
import {NativeGeocoderOptions, NativeGeocoderResult} from "@ionic-native/native-geocoder";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  animations: [SlideInOutAnimation]
})
export class FilterComponent implements OnInit {
  animationState = 'out';
  @Output() onSearchClicked = new EventEmitter();

  @ViewChildren('inputik') myInput ;
  jeOpen:boolean;

  sportOptions: Sport[] = [];
  minDate: any;
  friends: boolean = false;
  constructor(
      public toastController: ToastController,
  private fb: FormBuilder,
      private dataService: DataService,
      private datePicker: DatePicker,
      private platform: Platform
  ) {
    this.sportOptions = this.dataService.getSportsSk();
    this.minDate = new Date().toISOString();
    this.dataService.user$.subscribe(res=>{
      this.user = res
      console.log('thitt')
      console.log(res)
      console.log(this.user.friends)
    });
  }
  input: string;
  autocompleteItems: any[];
user:any
  activityForm = this.fb.group({
    place: [''],
    date: [''],
    toDate: [''],
    sport: [''],
    friends: [false]
  });

  ngOnInit() {
    this.activityForm.valueChanges.subscribe(() => {
      this.prepareData();

    });
    console.log(this.user)

    console.log(this.user.friends)


  }

  selectSearchResult(item) {
    // let place: google.maps.places.PlaceResult = this.GoogleAutocomplete.getPlacePredictions();
    console.log(item);
    this.input = item
    this.jeOpen = false;
    // this.location = item;
    // this.placeid = this.location.place_id;
    // //console.log(this.placeid);
    // JSON.stringify(item);   // tu potrebujem priradit vyber mesta po kliknuti, v iteme je object a ja potrebujem item.description
    // this.autocomplete.input = JSON.stringify(item, ['description']);
    // this.objekt = JSON.parse(this.autocomplete.input);
    // this.autocomplete.input = this.objekt.description;
    // //console.log('toto je mesto omg' + this.autocomplete.input);
    // for (let i = 0; i < 6; i++) {
    //   this.autocompleteItems.pop();
    }

    updateSearchResults() {
      if (this.input === '') {
        this.autocompleteItems = [];
        return;
      }
      this.jeOpen = true;
      console.log(this.input);

    }

    //console.log('kurwa co to nejde');
    // this.nativeGeocoder.reverseGeocode(52.5072095, 13.1452818, options)
    //     .then((result: NativeGeocoderReverseResult[]) => console.log(JSON.stringify(result[0])))
    //     .catch((error: any) => console.log(error));


  openDatePicker() {
    this.datePicker.show({
      date: new Date(),
      minDate: (this.platform.is('android')) ? (new Date()).valueOf() : new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
    }).then(
        date => this.activityForm.get('date').patchValue(new Date(date)),
        err => console.log('Error occurred while getting date: ', err)
    );
  }
  openDatePicker2() {
    var toDate = new Date();
    this.datePicker.show({
      date: new Date(),
      minDate: (this.platform.is('android')) ? (new Date()).valueOf() : new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
    }).then(
        date => this.activityForm.get('toDate').patchValue(new Date(date)),
        err => console.log('Error occurred while getting date: ', err)
    );
  }


  prepareData() {
    var userik = this.dataService.getUserFromDatabase();
    console.log(userik)
    console.log("toto je on")
    let filterData = [];

    if (this.activityForm.get('sport').value) {
      console.log(this.activityForm.get('sport').value);
      this.activityForm.get('sport').value.forEach(sport => {
      filterData.push({field: "sport", value: sport})
      })
    }

      if (this.activityForm.get('date').value || this.activityForm.get('toDate').value) {
        if (this.activityForm.get('toDate').value == ''){
          console.log("pushujemprvu")
          filterData.push({field: "date", value: new Date(this.activityForm.get('date').value).getTime(),
            value2: 0})
        }
        else if(this.activityForm.get('date').value == ''){
          filterData.push({field: "date", value: 0,
            value2: new Date(this.activityForm.get('toDate').value).getTime()})
        }
        else{
          filterData.push({field: "date", value: new Date(this.activityForm.get('date').value).getTime(),
            value2: new Date(this.activityForm.get('toDate').value).getTime()})
        }

      }
    if (this.activityForm.get('friends').value){
      this.dataService.getUserFromDatabase().friends.forEach(friend => {
        filterData.push({field: "createdBy", value: friend});
      });
    }
    console.log(filterData)
    this.onSearchClicked.emit(filterData);
  }

  toggleShowDiv() {
      this.animationState = this.animationState === 'out' ? 'in' : 'out';
  }

  async presentToast(message:any) {
    let zapnute;
    var toast;
    if (this.user.friends.length > 0) {
      if (this.activityForm.get('friends').value) {
        zapnute = 'zapnuté'
      } else {
        zapnute = 'vypnuté'
      }
       toast = await this.toastController.create({
        message: message+" "+ zapnute+'!',
        duration: 2000,
        color: 'medium'
      });
    }else{
      toast = await this.toastController.create({
        message: message+'!',
        duration: 2000,
        color: 'medium'
      });
    }

    toast.present();
  }
}

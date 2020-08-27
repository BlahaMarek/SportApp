import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Sport} from "../../models/sport";
import {DataService} from "../../data/data.service";
import { DatePicker } from '@ionic-native/date-picker/ngx';
import {Platform} from '@ionic/angular';
import {SlideInOutAnimation} from '../../animations/filterAnimation';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  animations: [SlideInOutAnimation]
})
export class FilterComponent implements OnInit {
  animationState = 'out';
  @Output() onSearchClicked = new EventEmitter();
  sportOptions: Sport[] = [];
  minDate: any;
  friends: boolean = false;
  constructor(
      private fb: FormBuilder,
      private dataService: DataService,
      private datePicker: DatePicker,
      private platform: Platform
  ) {
    this.sportOptions = this.dataService.getSportsSk();
    this.minDate = new Date().toISOString();
  }

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

    })
  }

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
    let filterData = [];
    if (this.activityForm.get('friends').value){
      this.dataService.getUserFromDatabase().friends.forEach(friend => {
            filterData.push({field: "createdBy", value: friend});
      });
    }
    if (this.activityForm.get('sport').value) {
      filterData.push({field: "sport", value: this.activityForm.get('sport').value})
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
        console.log(this.activityForm.get('toDate').value);

      }
    this.onSearchClicked.emit(filterData);
  }

  toggleShowDiv() {
      this.animationState = this.animationState === 'out' ? 'in' : 'out';
  }
}

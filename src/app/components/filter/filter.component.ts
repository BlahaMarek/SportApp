import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {FormBuilder, Validators} from "@angular/forms";
import {Sport} from "../../models/sport";
import {DataService} from "../../data/data.service";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  @Output() onSearchClicked = new EventEmitter();
  sportOptions: Sport[] = [];
  minDate: any;
  constructor(
      private fb: FormBuilder,
      private dataService: DataService,
  ) {
    this.sportOptions = this.dataService.getSportsSk();
    this.minDate = new Date().toISOString();
  }
  activityForm = this.fb.group({
    place: [''],
    date: [''],
    sport: [''],
  });
  ngOnInit() {
    this.activityForm.valueChanges.subscribe(() => {
      this.prepareData();
    })
  }


  prepareData() {
    let filterData = [];
    if (this.activityForm.get('sport').value) {
      filterData.push({field: "sport", value: this.activityForm.get('sport').value})
    }
    if (this.activityForm.get('date').value) {
      filterData.push({field: "date", value: this.activityForm.get('date').value})
    }
    this.onSearchClicked.emit(filterData);
  }
}

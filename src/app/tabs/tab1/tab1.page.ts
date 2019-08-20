import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  
  sportOptions = [{value: 0, label: 'A'}, {value: 1, label: 'B'}];
  constructor(private fb: FormBuilder) {}

  activityForm = this.fb.group({
    peopleCount: [''],
    place: [''],
    topActivity: [''],
    sport: this.fb.group({
      sportType: [''],
    }),
  });
}

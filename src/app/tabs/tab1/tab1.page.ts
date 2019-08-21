import { Component, NgZone } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  // @ts-ignore
  GoogleAutocomplete: google.maps.places.AutocompleteService;
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  sportOptions = [{value: 0, label: 'A'}, {value: 1, label: 'B'}];
  constructor(public zone: NgZone, private fb: FormBuilder) {
    // @ts-ignore
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }

  activityForm = this.fb.group({
    peopleCount: [''],
    place: [''],
    topActivity: [''],
    sport: this.fb.group({
      sportType: [''],
    }),
  });
  updateSearchResults() {
    if (this.autocomplete.input === '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
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
    console.log('ja som item' + item);
    this.location = item;
    this.placeid = this.location.place_id;
    JSON.stringify(item);   // tu potrebujem priradit vyber mesta po kliknuti, v iteme je object a ja potrebujem item.description
    this.autocomplete.input = JSON.stringify(item, [ 'description']);
    console.log('placeid' +  JSON.stringify(this.placeid));
    console.log('item' +  JSON.stringify(item));
    console.log('location' +  JSON.stringify(this.location));
    console.log('autocompleteinput' +  JSON.stringify(this.autocomplete.input));

  }
}

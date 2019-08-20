import {Component, NgZone} from '@angular/core';

declare var google;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']

})
export class Tab2Page {
  // @ts-ignore
  GoogleAutocomplete: google.maps.places.AutocompleteService;
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  constructor(
      public zone: NgZone,
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }

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
    console.log(item)
    this.location = item
    this.placeid = this.location.place_id
    console.log('placeid' + this.placeid);
  }



 }

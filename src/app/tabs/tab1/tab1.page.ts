import {Component, NgZone} from '@angular/core';

declare var google;

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
  sport = '';
  pocet = '';
  miesto = '';

  sport1 = '';
  pocet1 = '';
  miesto1 = '';



  constructor(
      public zone: NgZone,
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }


  refresh() {
    this.sport1 = this.sport;
    this.pocet1 = this.pocet;
    this.miesto1 = this.miesto;

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
    console.log(item);
    this.location = item;
    this.placeid = this.location.place_id;
    console.log('toto je location omg' + this.location);
    console.log('placeid' + this.placeid.toString());
  }
  GoTo() {
    return window.location.href = 'https://www.google.com/maps/place/?q=place_id:' + this.placeid;
  }
}

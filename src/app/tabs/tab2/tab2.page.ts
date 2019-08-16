import {AfterContentInit, Component, OnInit, ViewChild} from '@angular/core';
declare var google;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']

})
export class Tab2Page implements OnInit, AfterContentInit {
  map;
  // @ts-ignore
  @ViewChild('mapElement') mapElement;
  autocomplete: any;
  GoogleAutocomplete: any;
  autocompleteItems: any;
  zone: any;
  geocoder: any;
  markers: any;
  clearMarkers: any;
  position: any;
  marker: any;
  constructor() {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    // tslint:disable-next-line:new-parens
    this.geocoder = new google.maps.Geocoder;
    this.markers = [];
  }
  ngOnInit(): void {
  }
  ngAfterContentInit(): void {
    this.map = new google.maps.Map(
        this.mapElement.nativeElement, {
      center: { lat: -34.9011, lng: -56.1645 },
      zoom: 15
    });
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
    this.clearMarkers();
    this.autocompleteItems = [];

    this.geocoder.geocode({placeId: item.place_id}, (results, status) => {
      if ( status === 'OK' && results[0]) {
        const position = {
          lat: results[0].geometry.location.lat,
          lng: results[0].geometry.location.lng
        };
        const marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: this.map,
        });
        this.markers.push(marker);
        this.map.setCenter(results[0].geometry.location);
      }
    });
  }
}

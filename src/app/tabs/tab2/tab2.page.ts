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
  constructor() {
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






}

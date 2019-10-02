import {AfterContentInit, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {MenuController} from '@ionic/angular';

declare var google;
let position;
let marker;

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']

})
export class Tab2Page implements OnInit, AfterContentInit {
    map;
    // @ts-ignore
    @ViewChild('mapElement') mapElement;

    constructor(
    ) {
        // tu inportnut 1. z ts
        // vytvorit list aktivit
    }

    ngAfterContentInit(): void {
        this.map = new google.maps.Map(
            this.mapElement.nativeElement,
            {
                center: {lat: -34.397, lng: 150.644},
                zoom: 8
            });
        this.getMarkers();
    }

    ngOnInit(): void {
    }
    addMarkersToMap() {
        position = new google.maps.LatLng(48.6980985, 21.2340841); // tu pojde pozicia z firebasu
        marker = new google.maps.Marker({ position, title: 'Here' });
        marker.setMap(this.map);
    }
    // ked tu bude json, budeme prechadzat jsonom a postupne pridavat markre
    getMarkers() {
        // tslint:disable-next-line:variable-name
        // for (let _i = 0; _i < tu bude dlzka jsonu; _i++) { // pocet markrov
        //     if (_i > 0) {
        //         this.addMarkersToMap(// tu bude marker[i]);
        //     }
        // }
    }
}

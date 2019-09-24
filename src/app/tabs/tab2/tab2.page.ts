import {AfterContentInit, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {MenuController} from '@ionic/angular';

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

    constructor(
    ) {
    }

    ngAfterContentInit(): void {
        this.map = new google.maps.Map(
            this.mapElement.nativeElement,
            {
                center: {lat: -34.397, lng: 150.644},
                zoom: 8
            });
    }

    ngOnInit(): void {
    }
}

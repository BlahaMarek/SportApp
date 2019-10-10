import {AfterContentInit, AfterViewInit, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {MenuController} from '@ionic/angular';

// declare var google;

import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import Point from 'ol/geom/Point';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {fromLonLat} from 'ol/proj';
import { Geolocation } from '@ionic-native/geolocation/ngx';



declare var vectorSource;
declare var markerVectorLayer;
declare var ol;

const mapLat = -33.829357;
const mapLng = 150.961761;
const mapDefaultZoom = 10;
const positionFeature = new Feature();
const washingtonLonLat = [21.23408, 48.69809];
const washingtonWebMercator = fromLonLat(washingtonLonLat);
let a1;
let b1;
let pocet;
pocet = 0;
@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']

})
export class Tab2Page implements OnInit, AfterContentInit, AfterViewInit {
    map: Map;
    // // @ts-ignore
    // @ViewChild('mapElement') mapElement;

    constructor(
        private geolocation: Geolocation
    ) {
        // const accuracyFeature = new Feature({
        //     geometry: new Point([48.69809, 21.23408])
        // });
        // const view = new View({
        //     center: [0, 0],
        //     zoom: 2
        // });
        // const map = new Map({
        //     layers: [
        //         new TileLayer({
        //             source: new OSM()
        //         })
        //     ],
        //     target: 'map',
        //     view
        // });
        // // tslint:disable-next-line:no-shadowed-variable
        // const positionFeature = new Feature();
        // positionFeature.setStyle(new Style({
        //     image: new CircleStyle({
        //         radius: 6,
        //         fill: new Fill({
        //             color: '#3399CC'
        //         }),
        //         stroke: new Stroke({
        //             color: '#fff',
        //             width: 2
        //         })
        //     })
        // }));
        // tu inportnut 1. z ts
        // vytvorit list aktivit
    }
    locate() {
        this.geolocation.getCurrentPosition().then((resp) => {
            a1 = resp.coords.latitude ;
            b1 = resp.coords.longitude;
            console.log('toto jea1' + a1);
            this.map.getView().setCenter(fromLonLat([b1, a1]));
        }).catch((error) => {
            console.log('Error getting location', error);
        });
    }
    ngAfterViewInit(): void {
        if (a1 == null) {
            this.locate();
            console.log('toto je a1' + a1);
            console.log('toto je b1' + b1);
        } else { console.log('kures fakt preskakuje null'); }
        // tslint:disable-next-line:no-unused-expression
        new VectorLayer({
            map: this.map = new Map({
                layers: [
                    new TileLayer({
                        source: new OSM()
                    })],
                target: document.getElementById('map'),
                view: new View({
                    center: fromLonLat([0, 0]),
                    zoom: 12
                }),
            }),
            source: new VectorSource({
                features: [new Feature({
                    geometry: new Point(fromLonLat([21.23408, 48.69809])) // tu pojdu vsetky aktivity
                }), positionFeature]
            })
        });
        this.locate();
        setTimeout(() => {
            this.map.updateSize();
        }, 500);
        this.ionViewWillLeave();
    }

    // tslint:disable-next-line:use-lifecycle-interface
    ionViewWillLeave() {
        if (pocet > 0) {
            console.log('ted to pujde ');
            // this.map.setTarget(null); // toto to zavrie ale aj tak to nejde, gg
            this.map = null;
        }
        if (pocet === 0) {
            console.log('az teraz sa vypinam omg ');
            pocet++;
        }
    }


    ngAfterContentInit(): void {
        // this.map = new google.maps.Map(
        //         //     this.mapElement.nativeElement,
        //         //     {
        //         //         center: {lat: -34.397, lng: 150.644},
        //         //         zoom: 8
        //         //     });
        //         // this.getMarkers();
    }

    ngOnInit() {
    }

    initialize_map() {
    }


    addMarkersToMap() {
        // position = new google.maps.LatLng(48.6980985, 21.2340841); // tu pojde pozicia z firebasu
        // marker = new google.maps.Marker({ position, title: 'Here' });
        // marker.setMap(this.map);
    }

    // ked tu bude json, budeme prechadzat jsonom a postupne pridavat markre
    getMarkers() {
        // tslint:disable-next-line:variable-name  // toto neviem na ku ric tu je
        // for (let _i = 0; _i < tu bude dlzka jsonu; _i++) { // pocet markrov
        //     if (_i > 0) {
        //         this.addMarkersToMap(// tu bude marker[i]);
        //     }
        // }
    }
}

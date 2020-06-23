import {AfterContentInit, AfterViewInit, Component, NgZone, OnInit, ViewChild} from '@angular/core';

import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import Point from 'ol/geom/Point';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {Cluster, OSM, Vector as VectorSource} from 'ol/source';
import {fromLonLat} from 'ol/proj';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import BingMaps from 'ol/source/BingMaps';
import {ToastController} from '@ionic/angular';
import Circle from 'ol/geom/Circle';
import 'ol/ol.css';
import Overlay from 'ol/Overlay';

import {ActivityService} from "../../services/activity.service";
import {Activity} from "../../models/activity";
import {ActivityDetailComponent} from "../../components/activities/activity-detail/activity-detail.component";
import {ModalController} from '@ionic/angular';
import {AuthService} from "../../auth/auth.service";
import {Router} from '@angular/router';
import {DataService} from 'src/app/data/data.service';
import {Circle as CircleStyle, Fill, Stroke, Style, Text, Icon} from 'ol/style';
import {forEach} from "@angular-devkit/schematics";
import {isBoolean} from "util";
import {ActivityRatingComponent} from "../../components/activities/activity-rating/activity-rating.component";
import {ActivityListComponent} from "../../components/activities/activity-list/activity-list.component";


declare var ol: any;
// tslint:disable-next-line:prefer-const

declare var vectorSource;
declare var markerVectorLayer;
let markiza;
let sportName = 'futbal';
let pomocVpoliPriMarkeroch = false;
let nenasliSaRovnakeMarke = false;
const mapLat = -33.829357;
const mapLng = 150.961761;
const mapDefaultZoom = 10;
const positionFeature = new Feature();
const washingtonLonLat = [21.23408, 48.69809];
const washingtonWebMercator = fromLonLat(washingtonLonLat);
let a1;
let b1;
let pocet;
let markre: [];

const pomoc: number[] = []; // do pola zapisem hodnoty ktore sa rovnaju, a potom na konci ich budem kontrolovat ci uz nahodou neboli pridane
let rovnaky = false;
let k = 0;
const markres = [];
const markresEvent = [];
pocet = 0;
declare var $: any;
var idDoButtonu = [];
var idDoButtonuEvent = [];
const popup2 = new Overlay({
    element: document.getElementById('popup')
});

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']

})
export class Tab2Page implements OnInit, AfterContentInit, AfterViewInit {
    map: Map;
    user: any = {};
    featureName: any = {};
    image: any = '';
    private win: any = window;
    activityList: Activity[];
    result: any = [[]];

    // // @ts-ignore
    // @ViewChild('mapElement') mapElement;

    constructor(
        private router: Router,
        private authService: AuthService,
        private activityService: ActivityService,
        private modalController: ModalController,
        private geolocation: Geolocation,
        public toastController: ToastController,
        private dataService: DataService
    ) {
    }

    async presentToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 5000
        });
        toast.present();
    }

    ngAfterViewInit(): void {


        this.pridanieMarkerov();
        if (a1 == null) {
            this.locate();
            console.log('toto je a1' + a1);
            console.log('toto je b1' + b1);
        } else {
            console.log('kures fakt preskakuje null');
        }

        const map = new Map({
            layers: [
                new TileLayer({
                    source: new OSM()
                })],
            target: document.getElementById('map'),
            view: new View({
                center: fromLonLat([a1, b1]),
                zoom: 12
            }),
        });

        const popup = new Overlay({
            element: document.getElementById('popup'),
            positioning: 'bottom-center',
            stopEvent: false,
            offset: [0, -50]
        });

        map.addOverlay(popup);

        // tslint:disable-next-line:only-arrow-functions
        map.on('click', function (evt) {
            $(document.getElementById('popup')).popover('destroy');
            document.getElementById('testButton').style.display = "none";
            document.getElementById('testButton3').style.display = "none";
            idDoButtonu = [];
            const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
                var features = feature.get('features');
                if (features.length == 1) { // jedna aktivita
                    console.log(features.length);
                    return features[0];
                }
                if (features.length > 1) { // viacej aktivit pod klastrom
                    console.log(features.length);
                    return features;
                }
                return feature;
            });

            if (feature) {
                console.log("som tuu kde chcem byt");
                console.log(feature.length);
                if (feature.length >= 2) {
                    var coordinates = feature[0].getGeometry().getCoordinates();
                    popup.setPosition(coordinates);

                    var vsetkyRovnake = feature[0].values_.zdroj;
                    for (var i = 0; i < feature.length; i++) { // rozdelujem idcka podla zdroja ... aktivitu do id buttona  a event do iddobutttonaevent... necakane
                        if (vsetkyRovnake != feature[i].values_.zdroj) { //ak sa nahodou nejaka nebude rovnat 1. prvu nastavi  sa na false
                            vsetkyRovnake = false;
                        }
                        if (feature[i].values_.zdroj == "aktivita") {
                            try {
                                idDoButtonu.push(feature[i].get('id'))
                            } catch (error) {
                                console.error(error);
                                // idDoButtonu = [];
                            }
                        }
                        if (feature[i].values_.zdroj == "event") {
                            try {
                                idDoButtonuEvent.push(feature[i].get('id'))
                            } catch (error) {
                                console.error(error);
                                // idDoButtonuEvent = [];
                            }
                        }
                    }

                    if (vsetkyRovnake && feature[0].values_.zdroj == "aktivita") {
                        $(document.getElementById('popup')).popover({
                            placement: 'top',
                            html: true,
                            content: "Viacero športov",
                            animation: false,
                        });
                        var rect = document.getElementById('popup').getBoundingClientRect();
                        console.log("toto je voncooo");

                        document.getElementById('testButton').style.display = "block";
                        document.getElementById('testButton').style.position = "absolute";
                        document.getElementById('testButton').style.top = rect.top - 55 + "px";
                        document.getElementById('testButton').style.left = rect.left - 35 + "px";
                    }
                    if (vsetkyRovnake && feature[0].values_.zdroj == "event") {
                        $(document.getElementById('popup')).popover({
                            placement: 'top',
                            html: true,
                            content: "Viacero eventov",
                            animation: false,
                        });
                        var rect = document.getElementById('popup').getBoundingClientRect();
                        console.log("toto je voncooo");

                        document.getElementById('testButton3').style.display = "block";
                        document.getElementById('testButton3').style.position = "absolute";
                        document.getElementById('testButton3').style.top = rect.top - 55 + "px";
                        document.getElementById('testButton3').style.left = rect.left - 35 + "px";
                    }
                    if (!vsetkyRovnake) {
                        // TODO: opravit chybny popup pri kliku z otvoreneho popupu na inu aktivitu/ event
                        $(document.getElementById('popup')).popover({
                            placement: 'top',
                            html: true,
                            content: "Športy a aktivity",
                            animation: false,
                        });
                        var rect = document.getElementById('popup').getBoundingClientRect();
                        console.log("toto je voncooo");

                        document.getElementById('testButton').style.display = "block";
                        document.getElementById('testButton').style.position = "absolute";
                        document.getElementById('testButton').style.top = rect.top - 55 + "px";
                        document.getElementById('testButton').style.left = rect.left - 75 + "px";


                        document.getElementById('testButton3').style.display = "block";
                        document.getElementById('testButton3').style.position = "absolute";
                        document.getElementById('testButton3').style.top = rect.top - 55 + "px";
                        document.getElementById('testButton3').style.left = rect.left - 1 + "px";
                    }


                } else {
                    var coordinates = feature.getGeometry().getCoordinates();
                    popup.setPosition(coordinates);
                    // this.featureName = feature.get('name');
                    $(document.getElementById('popup')).popover({
                        placement: 'top',
                        html: true,
                        title: feature.get('name'),
                        animation: false,
                        // content: ['<div style="background: #0ec254" class="place">'+feature.get('place')+'</div>',
                        //     '<div class="people">'+ feature.get('peopleCount')+'</div>',
                        //     ].join(''),

                        content: feature.get('place') + `<br>`+ feature.get('peopleCount'), //bu takto ,alebo tak ako to je dole to nastylovat
                        // content: ['<div class="popover-header">pro</div>',
                        //     '<div class="popover-body">pro1</div>',
                        //     ].join(''),
                        //
                        template: 	'<div class="popover" role="tooltip">' +
                            '<div style="color: #0ec254" class="popover-title"></div>' + //neche to stylovaty :{
                            '<div style="background: #0ec254" class="popover-content"></div>' +
                            '</div>'
                    });
                    idDoButtonu = feature.get('id');
                    idDoButtonuEvent = feature.get('id');
                    var rect = document.getElementById('popup').getBoundingClientRect();
                    if (feature.values_.zdroj == "aktivita") {
                        document.getElementById('testButton').style.display = "block";
                        document.getElementById('testButton').style.position = "absolute";
                        document.getElementById('testButton').style.top = rect.top - 55 + "px";
                        document.getElementById('testButton').style.left = rect.left - 35 + "px";
                    }
                   else if (feature.values_.zdroj == "event") {
                        document.getElementById('testButton3').style.display = "block";
                        document.getElementById('testButton3').style.position = "absolute";
                        document.getElementById('testButton3').style.top = rect.top - 55 + "px";
                        document.getElementById('testButton3').style.left = rect.left - 35 + "px";
                    } else {
                        console.error("mame nieco ine ako event/aktrivita?")
                    }
                }

                $(document.getElementById('popup')).popover('show');


            } else {
                idDoButtonu = [];
                idDoButtonuEvent = [];
                $(document.getElementById('popup')).popover('destroy');
                document.getElementById('testButton').style.display = "none";
                document.getElementById('testButton3').style.display = "none";
            }
        });


        map.on('pointermove', function (e) {
            if (e.dragging) {
                idDoButtonu = [];
                idDoButtonuEvent = [];
                $(document.getElementById('popup')).popover('destroy');
                document.getElementById('testButton').style.display = "none";
                document.getElementById('testButton3').style.display = "none";
                return;
            }
            const pixel = map.getEventPixel(e.originalEvent);
            const hit = map.hasFeatureAtPixel(pixel);
            map.getTarget().style.cursor = hit ? 'pointer' : '';
        });

        var source = new VectorSource({
            features: markres
        });
        var source2 = new VectorSource({
            features: markresEvent
        });

        var clusterSource = new Cluster({
            distance: parseInt("20", 10),
            source: source
        });


        var styleCache = {};
        new VectorLayer({
            map: this.map = map,
            source: clusterSource,
            style: function (feature) {
                var size = feature.get('features').length;
                var style = styleCache[size];
                var coordinates = feature.getGeometry().getCoordinates();
                console.log("tento zdrojik si prosim");
                console.log(feature.values_.features[0].values_.zdroj);
                console.log(feature.get('features'));
                var vsetkyRovnake = true;
                if (feature.get('features').length > 1) {
                    var prvy = feature.values_.features[0].values_.zdroj;
                    for (var i = 1; i < feature.get('features').length; i++) {
                        if (prvy != feature.values_.features[i].values_.zdroj) {
                            vsetkyRovnake = false;
                            break
                        }
                    }
                }
                if (vsetkyRovnake == true) { //ked su v klastri len eventy/aktivitz
                    if (!style && feature.values_.features[0].values_.zdroj == 'aktivita') {
                        style = new Style({
                            image: new CircleStyle({
                                radius: 10,
                                stroke: new Stroke({
                                    color: '#fff'
                                }),
                                fill: new Fill({
                                    color: '#FF0000'
                                })
                            }),
                            text: new Text({
                                text: size.toString(),
                                fill: new Fill({
                                    color: '#fff'
                                })
                            })
                        });
                        // styleCache[size] = style;
                    }
                    if (!style && feature.values_.features[0].values_.zdroj == 'event') {
                        style = new Style({
                            image: new CircleStyle({
                                radius: 10,
                                stroke: new Stroke({
                                    color: '#fff'
                                }),
                                fill: new Fill({
                                    color: '#6D0DAF'
                                })
                            }),
                            text: new Text({
                                text: size.toString(),
                                fill: new Fill({
                                    color: '#fff'
                                })
                            })
                        });
                        // styleCache[size] = style;
                    }
                    return style;
                } else { // ked je v klastri aj aktivita aj event
                    if (!style) {
                        style = new Style({
                            image: new Icon({
                                color: '#8959A8',
                                crossOrigin: 'anonymous',
                                src: 'assets/sports/multisport.png',
                                scale: 0.1

                            }),
                            text: new Text({
                                text: size.toString(),
                                fill: new Fill({
                                    color: '#fff'
                                })
                            })
                        });
                        // styleCache[size] = style;
                    }
                    return style;


                }
            }
        });
        this.pridanieMarkerov();
        this.locate();
        // console.log('toto su markre');
        // console.log(markre);
        setTimeout(() => {
            this.map.updateSize();
        }, 500);
    }

    ionViewDidEnter(){
        setTimeout(() => {
            this.map.updateSize();
        }, 500);
    }

    prejdiDoTab1() {
        console.log("Toto otototototottotototo je id do aktivity z maaap");
        console.log(idDoButtonu);
        this.dataService.idZMapy = idDoButtonu;
        $(document.getElementById('popup')).popover('destroy');
        document.getElementById('testButton').style.display = "none";
        document.getElementById('testButton3').style.display = "none";
        idDoButtonu = [];
        idDoButtonuEvent = [];
        this.filteredActivitiesList(this.dataService.getIdZMapy(),true); //true aktivity
    }

    prejdiDoTab3() {
        console.log("Toto otototototottotototo je id do aktivity z maaap");
        console.log(idDoButtonu);
        this.dataService.idEventZMapy = idDoButtonuEvent;
        $(document.getElementById('popup')).popover('destroy');
        document.getElementById('testButton').style.display = "none";
        document.getElementById('testButton3').style.display = "none";
        idDoButtonu = [];
        idDoButtonuEvent = [];
        this.filteredActivitiesList(this.dataService.getidEventZMapy(), false); //false eventy
    }

    pridanieMarkerov() {

        if (this.dataService.getEvent() != null) {

            const resEvent = Array.from(Object.values(this.dataService.getEvent()), //eventy
                ({lattitude, longtitude, sport, id, peopleCount,place}) => [parseFloat(longtitude), parseFloat(lattitude), sport, id,peopleCount,place]);

            for (let o = 0; o < resEvent.length; o++) {  // ked som sa na toto pozrel po dlhsom case, bol som z roho v riti ako to vlastne funguje
                if (resEvent[o][5].toString().length > 12){
                    resEvent[o][5] = resEvent[o][5].toString().substring(0,12) + "..."
                }
                markiza = new Feature({                 //uz nie lebo som to upravil na klastre, pro
                    geometry: new Point(fromLonLat([resEvent[o][0], resEvent[o][1]])),
                    name: this.dataService.getSportNameByValue(Number(resEvent[o][2])),
                    id: resEvent[o][3],
                    zdroj: 'event',
                    place: resEvent[o][5],
                    peopleCount: resEvent[o][4]
                });
                markres.push(markiza);


            }
        }
        const res = Array.from(Object.values(this.dataService.getAktivitz()), //aktivity
            ({lattitude, longtitude, sport, id, peopleCount,place}) => [parseFloat(longtitude), parseFloat(lattitude), sport, id,peopleCount,place]);



        for (let o = 0; o < res.length; o++) {
            if (res[o][5].toString().length > 12){
                res[o][5] = res[o][5].toString().substring(0,12) + "..."
            }
            markiza = new Feature({
                geometry: new Point(fromLonLat([res[o][0], res[o][1]])),
                name: this.dataService.getSportNameByValue(Number(res[o][2])),
                id: res[o][3],
                zdroj: 'aktivita',
                place: res[o][5],
                peopleCount: res[o][4]
            });
            markres.push(markiza);


        }

        console.log("toto je sringik");


    }

    locate() {
        this.geolocation.getCurrentPosition().then((resp) => {
            a1 = resp.coords.latitude;
            b1 = resp.coords.longitude;
            console.log('toto jea1' + a1);
            this.presentToast('Toto je a1: ' + a1 + 'b1: ' + b1);
            this.map.getView().setCenter(fromLonLat([b1, a1]));
        }).catch((error) => {
            console.log('Error getting location', error);
        });
    }


    ngAfterContentInit(): void {
    }

    ngOnInit() {
        this.user = this.dataService.getSignInUser();
    }
    filteredActivitiesList(activitiesId, aktivityChcem){
        this.modalController
            .create({component: ActivityListComponent,
                componentProps:{
                    idSportsFromMap: activitiesId,
                    fromMap: true,
                    aktivita: aktivityChcem
                }

            })
            .then(modalEl => {
                console.log("Fus ro dah");
                modalEl.present();
                return modalEl.onDidDismiss();
            })
            .then(result => {

            });
    }
}

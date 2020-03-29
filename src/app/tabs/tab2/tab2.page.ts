import {AfterContentInit, AfterViewInit, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {MenuController} from '@ionic/angular';

// declare var google;
import {defaults as defaultControls, Control} from 'ol/control';import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import Point from 'ol/geom/Point';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {Cluster,OSM, Vector as VectorSource} from 'ol/source';
import {fromLonLat} from 'ol/proj';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import BingMaps from 'ol/source/BingMaps';
import { ToastController } from '@ionic/angular';
import Circle from 'ol/geom/Circle';
import 'ol/ol.css';
import Overlay from 'ol/Overlay';

import {ActivityService} from "../../services/activity.service";
import {Activity} from "../../models/activity";
import {ActivityDetailComponent} from "../../components/activities/activity-detail/activity-detail.component";
import {ModalController} from '@ionic/angular';
import {AuthService} from "../../auth/auth.service";
import { Router } from '@angular/router';
import { DataService } from 'src/app/data/data.service';
import {Circle as CircleStyle, Fill, Stroke, Style, Text, Icon} from 'ol/style';


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
pocet = 0;
declare var $: any;
var idDoButtonu = [];
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
    image:any='';
    private win: any = window;
    activityList: Activity[];
     result:any = [[]];

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
        // console.log('toto su markre');
        // console.log(markre);
        // console.log('toto su markres');
        // console.log(markres);
        if (a1 == null) {
            this.locate();
            console.log('toto je a1' + a1);
            console.log('toto je b1' + b1);
        } else { console.log('kures fakt preskakuje null'); }

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
        // function createInput(){
        //     var $input = $('<input type="button" value="new button" />');
        //     $input.appendTo($('body'));
        // }
        const popup = new Overlay({
            element: document.getElementById('popup'),
            positioning: 'bottom-center',
            stopEvent: false,
            offset: [0, -50]
        });
        const popup2 = new Overlay({
            element: document.getElementById('popup2'),
            positioning: 'bottom-center',
            stopEvent: false,
            offset: [0, -50]
        });
        map.addOverlay(popup);
        map.addOverlay(popup2);
        // tslint:disable-next-line:only-arrow-functions
        map.on('click', function(evt) {
            idDoButtonu = [];
            const feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
                var features = feature.get('features');
                if (features.length == 1) {
                    console.log("sam");
                    console.log(features.length);
                    return features[0];
                }
                if (features.length > 1) {
                    console.log(features.length);
                    console.log("je nas vac");
                    return features;
                }
                return feature;
            });

            if (feature) {
                console.log("som tuu kde chcem byt");
                console.log(feature.length);
                if (feature.length >= 2){
                    var coordinates = feature[0].getGeometry().getCoordinates();
                    popup.setPosition(coordinates);
                    $(document.getElementById('popup')).popover({
                        placement: 'top',
                        html: true,
                        content: feature[0].get('name')
                    });
                    for (var i = 0; i<feature.length; i++){
                        console.log(feature[i].get('id'));
                        try {
                            idDoButtonu.push(feature[i].get('id'))
                        }
                        catch(error) {
                            console.error(error);
                            idDoButtonu = [];
                        }

                    }



                }
                else {
                    var coordinates = feature.getGeometry().getCoordinates();
                    popup.setPosition(coordinates);
                    $(document.getElementById('popup')).popover({
                        placement: 'top',
                        html: true,
                        content: feature.get('name')
                    });
                    console.log("Toto je cislo kativity omg");
                    console.log(feature.get('id'));
                    idDoButtonu = feature.get('id');
                    console.log(feature.get('idcka'));
                }

                popup2.setPosition(coordinates);


                $('#testButton').click(function(){

                  });


                // console.log("Toto je cislo kativity omg");
                // console.log(feature.get('id'));
                // idDoButtonu = feature.get('id');
                // console.log(feature.get('idcka'));
                // $(document.getElementById('popup')).append('<input type="button" value="new button" />');
                $(document.getElementById('popup')).popover('show');
                $(document.getElementById('popup2')).popover('show');

            } else {
                idDoButtonu = [];
                $(document.getElementById('popup')).popover('destroy');
                $(document.getElementById('popup2')).popover('destroy');
            }
        });




        // tslint:disable-next-line:only-arrow-functions
        map.on('pointermove', function(e) {
            if (e.dragging) {
                $(document.getElementById('popup')).popover('destroy');
                $(document.getElementById('popup2')).popover('destroy');

                return;
            }
            const pixel = map.getEventPixel(e.originalEvent);
            const hit = map.hasFeatureAtPixel(pixel);
            map.getTarget().style.cursor = hit ? 'pointer' : '';
        });
        // tslint:disable-next-line:no-unused-expression

        var source = new VectorSource({
            features: markres
        });

        var clusterSource = new Cluster({
            distance: parseInt("20", 10),
            source: source
        });
        var styleCache = {};
        new VectorLayer({
            map: this.map = map,
            source: clusterSource,
            style: function(feature) {
                var size = feature.get('features').length;
                var style = styleCache[size];
                if (!style) {
                    style = new Style({
                        image: new CircleStyle({
                            radius: 10,
                            stroke: new Stroke({
                                color: '#fff'
                            }),
                            fill: new Fill({
                                color: '#3399CC'
                            })
                        }),
                        text: new Text({
                            text: size.toString(),
                            fill: new Fill({
                                color: '#fff'
                            })
                        })
                    });
                    styleCache[size] = style;
                }
                return style;
            }
        });
        // this.pridanieMarkerov();
        this.locate();
        // console.log('toto su markre');
        // console.log(markre);
        setTimeout(() => {
            this.map.updateSize();
        }, 500);
        this.ionViewWillLeave();
    }
    prejdiDoTab1(){
        console.log("Toto otototototottotototo je id do aktivity z maaap");
        console.log(idDoButtonu);
        this.dataService.idZMapy = idDoButtonu;
        this.router.navigateByUrl('/tabs/tabs/tab1');
    }
    pridanieMarkerov() {
        const places = [
            [0, 0, "nic", 0],
            [15, 15, "futbal", 0],
            [17.7, 1, "futbal", 1],
            [0.7, 1, "hokej", 2],
            [20, 20, "tenis", 3],
            [20, 1, "futbal", 4],
            [0.1, 0.1, "squash", 5]


        ];
        console.log("totototototooooooooooooooooooooooooooooooooooo");

        console.log(places);
        console.log(places[0][0]);
        console.log(places[0][2]);

        let hovno :string[][];
        // this.activityList = this.activityList.filter(activity => activity.bookedBy.forEach(function(value) {
        //
        //         //this.hovno.push(activity);
        //         console.log(activity);
        //     console.log("toto je moja value// " + value);
        //
        // }));


        this.activityService.activities$.subscribe(list => {
            this.activityList = list;
        });
        const res = Array.from(Object.values(this.activityList),
            ({lattitude,longtitude,sport, id}) => [parseFloat(longtitude),parseFloat(lattitude),sport, id]);
        console.log("moj array vysnivany");
        console.log(res);
        // console.log("toto je 0 0" + res[0][0]);
        // console.log("toto je 0 1" + res[0][1]);
        // console.log("toto je 0 2" + res[0][2]);
        // console.log("toto je 0 3" + res[0][3]);


        res.sort(sortFunction);
        places.sort(sortFunction);
        console.log(res);

        function sortFunction(a, b) {
            if (a[0] === b[0]) {
                return 0;
            }
            else {
                return (a[0] < b[0]) ? -1 : 1;
            }
        }


        for (let o = 0; o< res.length; o++) {  // ked som sa na toto pozrel po dlhsom case, bol som z roho v riti ako to vlastne funguje
            markiza = new Feature({
                        geometry: new Point(fromLonLat([res[o][0], res[o][1]])),
                        name: 'Futbal kurwa',
                        id: res[o][3]
                    });
            markres.push(markiza);




            // if (res[o][2].toString() == "3") {
            //     markiza = new Feature({
            //         geometry: new Point(fromLonLat([res[o][0], res[o][1]])),
            //         name: 'Futbal kurwa',
            //         id: res[o][3]
            //     });
            //     markiza.setStyle(new Style({
            //         image: new Icon({
            //             color: '#8959A8',
            //             crossOrigin: 'anonymous',
            //             src: 'assets/sports/soccer.svg',
            //             scale: 0.2
            //         })
            //     }));
            //     console.log("sport 4");
            //
            //
            // }

        }

        console.log("toto je sringik");



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
    locate() {
        this.geolocation.getCurrentPosition().then((resp) => {
            a1 = resp.coords.latitude ;
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
    }
}

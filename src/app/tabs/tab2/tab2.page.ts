import {AfterContentInit, AfterViewInit, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {MenuController} from '@ionic/angular';

// declare var google;
import {defaults as defaultControls, Control} from 'ol/control';import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import Point from 'ol/geom/Point';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
import {fromLonLat} from 'ol/proj';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import BingMaps from 'ol/source/BingMaps';
import { ToastController } from '@ionic/angular';
import Circle from 'ol/geom/Circle';
import 'ol/ol.css';
import Overlay from 'ol/Overlay';
import TileJSON from 'ol/source/TileJSON';
import {Icon, Style} from 'ol/style';
import {ActivityService} from "../../services/activity.service";
import {Activity} from "../../models/activity";
import {ActivityDetailComponent} from "../../components/activities/activity-detail/activity-detail.component";
import {ModalController} from '@ionic/angular';
import {AuthService} from "../../auth/auth.service";


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
var idDoButtonu;
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
        private authService: AuthService,
        private activityService: ActivityService,
        private modalController: ModalController,
        private geolocation: Geolocation,
        public toastController: ToastController
    ) {
    }
    async presentToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 5000
        });
        toast.present();
    }
      onActivityClicked(id: string) {
        console.log("Klikol som na aktivitu");
        var authService = this.authService.userIdAuth;
        this.modalController
            .create({
                component: ActivityDetailComponent,
                componentProps: {
                    selectedActivity: this.activityService.getActivityById(id),
                    bookable: !(this.activityService.getActivityById(id).createdBy === this.authService.userIdAuth),
                    reserved: (this.activityService.getActivityById(id).bookedBy.find(function (prihlaseny) {
                        return prihlaseny.includes(authService)

                    })),
                }
            })
            .then(modalEl => {
                modalEl.present();
                return modalEl.onDidDismiss();
            })
            .then(result => {
                console.log(result);
            });
    }
    ngAfterViewInit(): void {

        var RotateNorthControl = /*@__PURE__*/(function (Control) {
            function RotateNorthControl(opt_options) {
                var options = opt_options || {};

                var button = document.createElement('button');
                button.innerHTML = 'Aktivita';

                var element = document.createElement('div');
                element.className = 'rotate-north ol-unselectable ol-control';
                element.appendChild(button);

                Control.call(this, {
                    element: element,
                    target: options.target
                });

                button.addEventListener('click', this.handleRotateNorth.bind(this), false);
            }

            if ( Control ) RotateNorthControl.__proto__ = Control;
            RotateNorthControl.prototype = Object.create( Control && Control.prototype );
            RotateNorthControl.prototype.constructor = RotateNorthControl;

            RotateNorthControl.prototype.handleRotateNorth = function handleRotateNorth () {
                this.getMap().getView().setRotation(0);
                //alert("hovno");
                console.log("hovno" + idDoButtonu);
                //this.onActivityClicked(idDoButtonu);
            };

            return RotateNorthControl;
        }(Control));


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
            controls: defaultControls().extend([
                // @ts-ignore
                new RotateNorthControl()
            ]),
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
            const feature = map.forEachFeatureAtPixel(evt.pixel,
                // tslint:disable-next-line:only-arrow-functions no-shadowed-variable
                function(feature) {
                    return feature;
                });
            if (feature) {
                const coordinates = feature.getGeometry().getCoordinates();
                popup.setPosition(coordinates);
                popup2.setPosition(coordinates);
                $(document.getElementById('popup')).popover({
                    placement: 'top',
                    html: true,
                    content: feature.get('name')
                });
                $(document.getElementById('popup2')).popover({
                    placement: 'top',
                    html: true,
                    id: feature.get('id')
                });



               //$(document.getElementById('popup2')).addEventListener('click', this.onActivityClicked); // toto treba spravit, fnuk
                console.log("Toto je cislo kativity omg");
                console.log(feature.get('id'));
                idDoButtonu = feature.get('id');
                console.log(feature.get('idcka'));
                // $(document.getElementById('popup')).append('<input type="button" value="new button" />');
                $(document.getElementById('popup')).popover('show');
                $(document.getElementById('popup2')).popover('show');

            } else {
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
        new VectorLayer({
            map: this.map = map,
            source: new VectorSource({
                features: markres
            })
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
            rovnaky = false;
            let zapisMultiMarka = [];
            for (let forward = o+1; forward<res.length; forward++) {
                if (o > 0) {
                    if (res[o][0] != res[o - 1][0]) {
                        if (res[o][0] == res[forward][0]) {
                            if (rovnaky == false) {
                                zapisMultiMarka.push(res[o][3]);
                                rovnaky = true;
                            }
                            zapisMultiMarka.push(res[forward][3]);
                            if (forward == res.length - 1 && zapisMultiMarka.length > 0) {

                                markiza = new Feature({
                                    geometry: new Point(fromLonLat([res[o][0], res[o][1]])),
                                    name: 'Viacero športov',
                                    id: res[o][3],
                                    idcka: zapisMultiMarka
                                });
                                markiza.setStyle(new Style({
                                    image: new Icon({
                                        color: '#8959A8',
                                        crossOrigin: 'anonymous',
                                        src: 'assets/sports/multisport.png',
                                        scale: 0.1
                                    })
                                }));
                                markres.push(markiza);
                                break;
                            }
                            if (forward == res.length - 1 && zapisMultiMarka.length < 1) {

                                if (res[o][2].toString() == "3") {
                                    markiza = new Feature({
                                        geometry: new Point(fromLonLat([res[o][0], res[o][1]])),
                                        name: 'Futbal kurwa',
                                        id: res[o][3]
                                    });
                                    markiza.setStyle(new Style({
                                        image: new Icon({
                                            color: '#8959A8',
                                            crossOrigin: 'anonymous',
                                            src: 'assets/sports/soccer.svg',
                                            scale: 0.2
                                        })
                                    }));
                                    console.log("sport 4");
                                }
                                if (res[o][2].toString() == "6") {
                                    markiza = new Feature({
                                        geometry: new Point(fromLonLat([res[o][0], res[o][1]])),
                                        name: 'Futbal kurwa',
                                        // @ts-ignore
                                        id: res[o][3]
                                    });
                                    markiza.setStyle(new Style({
                                        image: new Icon({
                                            color: '#8959A8',
                                            crossOrigin: 'anonymous',
                                            src: 'assets/sports/hockey.svg',
                                            scale: 0.2
                                        })
                                    }));
                                    console.log("sport 6");

                                }
                                if (res[o][2].toString() == "1") {
                                    markiza = new Feature({
                                        geometry: new Point(fromLonLat([res[o][0], res[o][1]])),
                                        name: 'Futbal kurwa',
                                        id: res[o][3]
                                    });
                                    markiza.setStyle(new Style({
                                        image: new Icon({
                                            color: '#8959A8',
                                            crossOrigin: 'anonymous',
                                            src: 'assets/sports/tennis.svg',
                                            scale: 0.2
                                        })
                                    }));
                                    console.log("sport 1");

                                }
                                if (res[o][2].toString() == "2") {
                                    markiza = new Feature({
                                        geometry: new Point(fromLonLat([res[o][0], res[o][1]])),
                                        name: 'Futbal kurwa',
                                        // @ts-ignore
                                        id: res[o][3]
                                    });
                                    markiza.setStyle(new Style({
                                        image: new Icon({
                                            color: '#8959A8',
                                            crossOrigin: 'anonymous',
                                            src: 'assets/sports/squash.svg',
                                            scale: 0.4
                                        })
                                    }));
                                    console.log("sport 2");

                                }
                                console.log("pushujem sporty");

                                markres.push(markiza);
                                break;
                            }

                        }
                        if (res[o][0] != res[forward][0] && zapisMultiMarka.length > 0) {
                            markiza = new Feature({
                                // @ts-ignore
                                geometry: new Point(fromLonLat([res[o][0], res[o][1]])),
                                name: 'Viacero športov',
                                id: res[o][3],
                                idcka: zapisMultiMarka
                            });
                            markiza.setStyle(new Style({
                                image: new Icon({
                                    color: '#8959A8',
                                    crossOrigin: 'anonymous',
                                    src: 'assets/sports/multisport.png',
                                    scale: 0.1
                                })
                            }));
                            markres.push(markiza);

                            break;
                        }
                        if (res[o][0] != res[forward][0] && zapisMultiMarka.length < 1) {
                            console.log("toto su chybove parametre");
                            console.log(res[o][0]);
                            console.log(res[o][1]);

                            console.log(res[o][2]);
                            console.log(res[o][3]);


                            if (res[o][2].toString() == "4") {
                                markiza = new Feature({
                                    // @ts-ignore
                                    geometry: new Point(fromLonLat([res[o][0], res[o][1]])),
                                    name: 'Futbal kurwa',
                                    id: res[o][3]
                                });
                                markiza.setStyle(new Style({
                                    image: new Icon({
                                        color: '#8959A8',
                                        crossOrigin: 'anonymous',
                                        src: 'assets/sports/soccer.svg',
                                        scale: 0.2
                                    })
                                }));
                                console.log("sport 4");

                            }
                            if (res[o][2].toString() == "6") {
                                markiza = new Feature({
                                    // @ts-ignore
                                    geometry: new Point(fromLonLat([res[o][0], res[o][1]])),
                                    name: 'Futbal kurwa',
                                    id: res[o][3]
                                });
                                markiza.setStyle(new Style({
                                    image: new Icon({
                                        color: '#8959A8',
                                        crossOrigin: 'anonymous',
                                        src: 'assets/sports/hockey.svg',
                                        scale: 0.2
                                    })
                                }));
                                console.log("sport 6");

                            }
                            if (res[o][2].toString() == "1") {
                                markiza = new Feature({
                                    // @ts-ignore
                                    geometry: new Point(fromLonLat([res[o][0], res[o][1]])),
                                    name: 'Futbal kurwa',
                                    id: res[o][3]
                                });
                                markiza.setStyle(new Style({
                                    image: new Icon({
                                        color: '#8959A8',
                                        crossOrigin: 'anonymous',
                                        src: 'assets/sports/tennis.svg',
                                        scale: 0.2
                                    })
                                }));
                                console.log("sport 1");

                            }
                            if (res[o][2].toString() == "3") {
                                markiza = new Feature({
                                    // @ts-ignore
                                    geometry: new Point(fromLonLat([res[o][0], res[o][1]])),
                                    name: 'Futbal kurwa',
                                    id: res[o][3]
                                });
                                markiza.setStyle(new Style({
                                    image: new Icon({
                                        color: '#8959A8',
                                        crossOrigin: 'anonymous',
                                        src: 'assets/sports/squash.svg',
                                        scale: 0.2
                                    })
                                }));
                                console.log("sport 3");

                            }
                            console.log(markiza);
                            if (markiza != undefined) {
                                markres.push(markiza);
                                markiza = undefined;

                            }
                            break;
                        }
                        if (o == res.length - 1 && zapisMultiMarka.length > 0) {
                            markiza = new Feature({
                                // @ts-ignore
                                geometry: new Point(fromLonLat([res[o][0], res[o][1]])),
                                name: 'Viacero športov',
                                id: res[o][3],
                                idcka: zapisMultiMarka
                            });
                            markiza.setStyle(new Style({
                                image: new Icon({
                                    color: '#8959A8',
                                    crossOrigin: 'anonymous',
                                    src: 'assets/sports/multisport.png',
                                    scale: 0.1
                                })
                            }));
                            markres.push(markiza);
                            break;
                        } else if (o == res.length - 1 && zapisMultiMarka.length < 1) {
                            if (res[o][2].toString() == "4") {
                                markiza = new Feature({
                                    // @ts-ignore
                                    geometry: new Point(fromLonLat([parseFloat(res[o][0]), parseFloat(res[o][1])])),
                                    name: 'Futbal kurwa',
                                    id: 3
                                });
                                markiza.setStyle(new Style({
                                    image: new Icon({
                                        color: '#8959A8',
                                        crossOrigin: 'anonymous',
                                        src: 'assets/sports/soccer.svg',
                                        scale: 0.2
                                    })
                                }));
                                console.log("sport 4");

                            }
                            if (res[o][2].toString() == "1") {
                                markiza = new Feature({
                                    // @ts-ignore
                                    geometry: new Point(fromLonLat([parseFloat(res[o][0]), parseFloat(res[o][1])])),
                                    name: 'Futbal kurwa',
                                    id: 3
                                });
                                markiza.setStyle(new Style({
                                    image: new Icon({
                                        color: '#8959A8',
                                        crossOrigin: 'anonymous',
                                        src: 'assets/sports/hockey.svg',
                                        scale: 0.2
                                    })
                                }));
                                console.log("sport 1");

                            }
                            if (res[o][2].toString() == "3") {
                                markiza = new Feature({
                                    // @ts-ignore
                                    geometry: new Point(fromLonLat([parseFloat(res[o][0]), parseFloat(res[o][1])])),
                                    name: 'Futbal kurwa',
                                    id: 3
                                });
                                markiza.setStyle(new Style({
                                    image: new Icon({
                                        color: '#8959A8',
                                        crossOrigin: 'anonymous',
                                        src: 'assets/sports/tennis.svg',
                                        scale: 0.2
                                    })
                                }));
                                console.log("sport 1");

                            }
                            if (res[o][2].toString() == "2") {


                                markiza = new Feature({
                                    // @ts-ignore
                                    geometry: new Point(fromLonLat([parseFloat(res[o][0]), parseFloat(res[o][1])])),
                                    name: 'Futbal kurwa'
                                });
                                markiza.setStyle(new Style({
                                    image: new Icon({
                                        color: '#8959A8',
                                        crossOrigin: 'anonymous',
                                        src: 'assets/sports/squash.svg',
                                        scale: 0.2
                                    })
                                }));
                                console.log("sport 2");

                            }

                            markres.push(markiza);
                            break;
                        } else {
                            console.log("Neco se porantalo");

                        }
                    } else {
                        console.log("Nasiel som rovnakych dozadu");
                        break;

                    }
                }

            }}

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

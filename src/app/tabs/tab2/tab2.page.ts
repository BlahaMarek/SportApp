import {AfterContentInit, AfterViewInit, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {MenuController} from '@ionic/angular';

// declare var google;
// import * as $ from 'jquery';
import 'ol/ol.css';
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


declare var ol: any;
// tslint:disable-next-line:prefer-const

declare var vectorSource;
declare var markerVectorLayer;
let markiza;
let sportName = 'futbal';
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

    // // @ts-ignore
    // @ViewChild('mapElement') mapElement;

    constructor(
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
        function createInput(){
            var $input = $('<input type="button" value="new button" />');
            $input.appendTo($('body'));
        }
        const popup = new Overlay({
            element: document.getElementById('popup'),
            positioning: 'bottom-center',
            stopEvent: false,
            offset: [0, -50]
        });
        map.addOverlay(popup);
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
                $(document.getElementById('popup')).popover({
                    placement: 'top',
                    html: true,
                     content: feature.get('name'),
                });
               // $(document.getElementById('popup')).append('<input type="button" value="new button" />');
                $(document.getElementById('popup')).popover('show');
            } else {
                $(document.getElementById('popup')).popover('destroy');
            }
        });
        // tslint:disable-next-line:only-arrow-functions
        map.on('pointermove', function(e) {
            if (e.dragging) {
                $(document.getElementById('popup')).popover('destroy');
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
            [10.17283, 40.89502, "futbal"],
            [11.17283, 48.69809, "hokej"],
            [35.17283, 40.89502, "tenis"],
            [30.17283, 40.89502, "futbal"],
            [17.17283, 40.89502, "squash"]


        ];
        for (let o = 0; o< places.length; o++){
            if (o == places.length-1){
                console.log("Toto je dlzka palces");
                console.log(places.length);
                k=o-1;
                rovnaky = false;
                do {
                    //for (k = o - 1; k >= 0; k--) {
                        //     console.log(pomoc[k])

                        if (places[k][0] == places[o][0]) {
                            rovnaky = true;
                            console.log('kurwa mam rovnake obraky');
                            console.log(k);
                            console.log(o);
                            k--;
                        }
                            k--;
                   // }
                } while (k >= 0);
                //}
                //     console.log(pomoc[k])
                if (rovnaky !=true) {
                    k--;
                    if (places[o][2] == "futbal") {
                        markiza = new Feature({
                            geometry: new Point(fromLonLat([places[o][0], places[o][1]])),
                            name: 'Futbal kurwa'
                        });
                        markiza.setStyle(new Style({
                            image: new Icon({
                                color: '#8959A8',
                                crossOrigin: 'anonymous',
                                src: 'assets/sports/soccer.svg',
                                scale: 0.4
                            })
                        }));
                    }
                    if (places[o][2] == "hokej") {
                        markiza = new Feature({
                            geometry: new Point(fromLonLat([places[o][0], places[o][1]])),
                            name: 'Futbal kurwa'
                        });
                        markiza.setStyle(new Style({
                            image: new Icon({
                                color: '#8959A8',
                                crossOrigin: 'anonymous',
                                src: 'assets/sports/hockey.svg',
                                scale: 0.4
                            })
                        }));
                    }
                    if (places[o][2] == "tenis") {
                        markiza = new Feature({
                            geometry: new Point(fromLonLat([places[o][0], places[o][1]])),
                            name: 'Futbal kurwa'
                        });
                        markiza.setStyle(new Style({
                            image: new Icon({
                                color: '#8959A8',
                                crossOrigin: 'anonymous',
                                src: 'assets/sports/tennis.svg',
                                scale: 0.4
                            })
                        }));
                    }
                    if (places[o][2] == "squash") {
                        markiza = new Feature({
                            geometry: new Point(fromLonLat([places[o][0], places[o][1]])),
                            name: 'Futbal kurwa'
                        });
                        markiza.setStyle(new Style({
                            image: new Icon({
                                color: '#8959A8',
                                crossOrigin: 'anonymous',
                                src: 'assets/sports/squash.svg',
                                scale: 0.4
                            })
                        }));
                    }

                    markres.push(markiza);
                }
            }


            let pomocna = places[o][0];
            let pomocna2 = places[o][1];

                for (let l = o+1; l < places.length; l++) {
                    rovnaky=false;
                    if (places[o][0] == places[l][0]) {
                         //pomoc.push(places[1][0]); //tu si budem zapisovat hodnoty ktore sa rovnaju
                        if (places[o][2] == "futbal") {
                            markiza = new Feature({
                                geometry: new Point(fromLonLat([places[o][0], places[o][1]])),
                                name: 'Futbal kurwa'
                            });
                            markiza.setStyle(new Style({
                                image: new Icon({
                                    color: '#8959A8',
                                    crossOrigin: 'anonymous',
                                    src: 'assets/sports/soccer.svg',
                                    scale: 0.4
                                })
                            }));
                        }
                        if (places[o][2] == "hokej") {
                            markiza = new Feature({
                                geometry: new Point(fromLonLat([places[o][0], places[o][1]])),
                                name: 'Futbal kurwa'
                            });
                            markiza.setStyle(new Style({
                                image: new Icon({
                                    color: '#8959A8',
                                    crossOrigin: 'anonymous',
                                    src: 'assets/sports/hockey.svg',
                                    scale: 0.4
                                })
                            }));
                        }
                        if (places[o][2] == "tenis") {
                            markiza = new Feature({
                                geometry: new Point(fromLonLat([places[o][0], places[o][1]])),
                                name: 'Futbal kurwa'
                            });
                            markiza.setStyle(new Style({
                                image: new Icon({
                                    color: '#8959A8',
                                    crossOrigin: 'anonymous',
                                    src: 'assets/sports/tennis.svg',
                                    scale: 0.4
                                })
                            }));
                        }
                        if (places[o][2] == "squash") {
                            markiza = new Feature({
                                geometry: new Point(fromLonLat([places[o][0], places[o][1]])),
                                name: 'Futbal kurwa'
                            });
                            markiza.setStyle(new Style({
                                image: new Icon({
                                    color: '#8959A8',
                                    crossOrigin: 'anonymous',
                                    src: 'assets/sports/squash.svg',
                                    scale: 0.4
                                })
                            }));
                        }

                        markres.push(markiza);
                        break;

                    }
                    else { // daco treba dolati, nejde mi debug :(
                       // if (pomoc.length != null) {
                            do {
                                for (k = o - 1; k >= 0; k--) {
                                    //     console.log(pomoc[k])

                                    if (places[k][0] == places[o][0]) {
                                        rovnaky = true;
                                        console.log('kurwa mam rovnake obraky')
                                    }

                                }
                            } while (k >= 0);
                        //}
                        //     console.log(pomoc[k])
                            if (rovnaky !=true && l == places.length-1) {
                                k--;
                                if (places[o][2] == "futbal") {
                                    markiza = new Feature({
                                        geometry: new Point(fromLonLat([places[o][0], places[o][1]])),
                                        name: 'Futbal kurwa'
                                    });
                                    markiza.setStyle(new Style({
                                        image: new Icon({
                                            color: '#8959A8',
                                            crossOrigin: 'anonymous',
                                            src: 'assets/sports/soccer.svg',
                                            scale: 0.4
                                        })
                                    }));
                                }
                                if (places[o][2] == "hokej") {
                                    markiza = new Feature({
                                        geometry: new Point(fromLonLat([places[o][0], places[o][1]])),
                                        name: 'Futbal kurwa'
                                    });
                                    markiza.setStyle(new Style({
                                        image: new Icon({
                                            color: '#8959A8',
                                            crossOrigin: 'anonymous',
                                            src: 'assets/sports/hockey.svg',
                                            scale: 0.4
                                        })
                                    }));
                                }
                                if (places[o][2] == "tenis") {
                                    markiza = new Feature({
                                        geometry: new Point(fromLonLat([places[o][0], places[o][1]])),
                                        name: 'Futbal kurwa'
                                    });
                                    markiza.setStyle(new Style({
                                        image: new Icon({
                                            color: '#8959A8',
                                            crossOrigin: 'anonymous',
                                            src: 'assets/sports/tennis.svg',
                                            scale: 0.4
                                        })
                                    }));
                                }
                                if (places[o][2] == "squash") {
                                    markiza = new Feature({
                                        geometry: new Point(fromLonLat([places[o][0], places[o][1]])),
                                        name: 'Futbal kurwa'
                                    });
                                    markiza.setStyle(new Style({
                                        image: new Icon({
                                            color: '#8959A8',
                                            crossOrigin: 'anonymous',
                                            src: 'assets/sports/squash.svg',
                                            scale: 0.4
                                        })
                                    }));
                                }

                                markres.push(markiza);
                            }

                    }
                }


        }
        // tslint:disable-next-line:prefer-for-of
        // for (let i = 0; i < places.length ; i++) {
        //     markiza = new Feature({
        //        geometry: new Point(fromLonLat([places[i][0], places[i][1]])),
        //         name: 'Futbal Chýbajú:2'
        //    });
        //     if (sportName === 'futbal' ) {
        //         markiza.setStyle(new Style({
        //             image: new Icon({
        //                 color: '#8959A8',
        //                 crossOrigin: 'anonymous',
        //                 src: 'assets/sports/soccer.svg',
        //                 scale: 0.4
        //             })
        //         }));
        //     }
        //     markres.push(markiza);
        // }
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

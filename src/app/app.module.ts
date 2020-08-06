import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy, ToastController} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import { FilePath } from '@ionic-native/file-path/ngx';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MenuComponent} from './components/menu/menu.component';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {IonicStorageModule} from '@ionic/storage';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {NativeGeocoder} from '@ionic-native/native-geocoder/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import {ActivityRatingComponent} from "./components/activities/activity-rating/activity-rating.component";
import { StarRatingModule } from 'ionic4-star-rating';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { AngularFireAuthModule } from '@angular/fire/auth';
import * as firebase from 'firebase';
import {VisitUserProfileComponent} from "./pages/visit-user-profile/visit-user-profile.component";
import { Network } from '@ionic-native/network/ngx';
import {ActivityListComponent} from "./components/activities/activity-list/activity-list.component";
import {SharedModule} from "./modules/shared/shared.module";
import {ActivityDetailComponent} from "./components/activities/activity-detail/activity-detail.component";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {ActivityUpdateComponent} from "./components/activities/activity-update/activity-update.component";

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
firebase.initializeApp(environment.firebaseConfig);
@NgModule({
    declarations: [AppComponent, MenuComponent, ActivityRatingComponent, VisitUserProfileComponent, ActivityUpdateComponent],
    entryComponents: [ActivityRatingComponent, VisitUserProfileComponent, ActivityListComponent,ActivityUpdateComponent, ActivityDetailComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        IonicStorageModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        StarRatingModule,
        SharedModule
    ],
    providers: [
        Facebook,
        Geolocation,
        GooglePlus,
        NativeGeocoder,
        StatusBar,
        SplashScreen,
        WebView,
        FilePath,
        LocalNotifications,
        SocialSharing,
        ToastController,
        Network,
        DatePicker,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    exports: [

    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

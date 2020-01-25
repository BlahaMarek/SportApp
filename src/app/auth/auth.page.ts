import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Sport } from '../models/sport';
import * as firebase from 'firebase';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage  {
  userProfile: any = null;
  constructor(public navCtrl: NavController, private facebook: Facebook, private router: Router) {}

  facebookLogin(): void {
    this.facebook.login(['email']).then( (response) => {
      const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(response.authResponse.accessToken);

      firebase.auth().signInWithCredential(facebookCredential)
          .then((success) => {
            console.log("Firebase success: " + JSON.stringify(success));
            this.userProfile = success;
          })
          .catch((error) => {
            console.log("Firebase failure: " + JSON.stringify(error));
          });

    }).catch((error) => { console.log(error) });
  }


  onSubmitClick() {
    this.router.navigateByUrl('/tabs/tabs/tab1');
  }
}

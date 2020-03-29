import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Sport } from '../models/sport';
import * as firebase from 'firebase';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import {NavController, ToastController} from "@ionic/angular";
import {DataService} from "../data/data.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  userProfile: any = null;
  constructor(private dataService: DataService,public navCtrl: NavController, private facebook: Facebook, private router: Router,public toastController: ToastController,
  ) {}

    ngOnInit(): void {
      if (this.userProfile != null){
          this.router.navigateByUrl('/tabs/tabs/tab1');
      }
    }

  facebookLogin(): void {
    this.facebook.login(['email']).then( (response) => {
      const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(response.authResponse.accessToken);

      firebase.auth().signInWithCredential(facebookCredential)
          .then((success) => {
            console.log("som v page" + JSON.stringify(success));
            
            console.log(this.dataService.user);
            this.dataService.user = success;
            this.dataService.logged = true;
            this.dataService.refreshAfterLogin = true;
            this.presentToast("Úspešne prihlásený ako " + this.dataService.getSignInUser().user.displayName);
            this.router.navigateByUrl('/tabs/tabs/tab1');
          })
          .catch((error) => {
            console.log("Firebase failure: " + JSON.stringify(error));
              this.presentToast("Prihlásenie neúspešné");
          });

    }).catch((error) => { console.log(error) });
  }
    async presentToast(message:any) {
        const toast = await this.toastController.create({
            message: message,
            duration: 2000,
            color: 'medium'
        });
        toast.present();
    }

  onSubmitClick() {
    this.dataService.refreshAfterLogin = true;
    this.router.navigateByUrl('/tabs/tabs/tab1');
  }


}

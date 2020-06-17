import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook/ngx';
import {NavController, ToastController} from "@ionic/angular";
import {DataService} from "../data/data.service";
import {UserService} from "../services/user.service";
import {FirestoreService} from "../services/firestore.service";
import {User} from "../models/user";
import { Network } from '@ionic-native/network/ngx';
import {
    trigger,
    state,
    style,
    animate,
    transition,
} from '@angular/animations';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
    animations: [
        trigger('openClose', [
            // ...
            state('open', style({
                top: '-100px',
                opacity: 0.5,
            })),
            state('open1', style({
                top: '-100px',
                opacity: 0.5,
            })),
            state('open2', style({
                top: '-30px',
                opacity: 0.5,
            })),
            state('open3', style({
                top: '50px',
                opacity: 0.5,
            })),
            state('closed', style({
                top: '0px',
                opacity: 1,
            })),
            state('closed2', style({
                top: '20px',
                opacity: 1,
            })),
            transition('open => closed', [
                animate('600ms cubic-bezier(.85,1.24,.81,1.22)')
            ]),
            transition('open1 => closed', [
                animate('600ms 200ms cubic-bezier(.85,1.24,.81,1.22)')
            ]),
            transition('open2 => closed', [
                animate('600ms cubic-bezier(.85,1.24,.81,1.22)')
            ]),
            transition('open3 => closed2', [
                animate('600ms cubic-bezier(.85,1.24,.81,1.22)')
            ]),

        ]),
    ],
})
export class AuthPage implements OnInit {
    user: User = {behavior: 0, friends: [], id: "", name: "", photoUrl: ""};
    hasConnection = true;
    isOpen = true;

    constructor(
        private network: Network,
        private firestore: FirestoreService,
        private userService:UserService,
        private dataService: DataService,
        public navCtrl: NavController,
        private facebook: Facebook,
        private router: Router,
        public toastController: ToastController
    ) {}

    ngOnInit(): void {
      if (!this.isConnected) {
          this.presentToast("Žiadne pripojenie k internetu");
      }
      if (localStorage.getItem('user') && this.isConnected){
          this.dataService.user = JSON.parse(localStorage.getItem('user'));
          this.dataService.logged = true;
          this.dataService.refreshAfterLogin = true;
          this.router.navigateByUrl('/tabs/tabs/tab1');
      }

    }

    ionViewWillEnter() {
        this.isOpen = false;
    }

    get isConnected(): boolean {
        let connectionType = this.network.type;
        return connectionType && connectionType !== 'unknown' && connectionType !== 'none';
    }

    facebookLogin(): void {
        this.facebook.login(['email']).then( (response) => {
          const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);

          firebase.auth().signInWithCredential(facebookCredential)
              .then((user) => {
                this.dataService.user = user;
                localStorage.setItem("user", JSON.stringify(user))
                this.dataService.logged = true;
                this.dataService.refreshAfterLogin = true;
                this.router.navigateByUrl('/tabs/tabs/tab1');
              })
              .catch((error) => {
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

    ionViewWillLeave(){
        if (this.dataService.logged == true){
            this.createUserToDataabse()
        }
    }

    createUserToDataabse(){
        this.userService.getOneUser(this.dataService.getSignInUser().user.uid).subscribe(res=>{  //ak nenajde usera v databaze vytvori ho...
            if (res==undefined){
                this.user = {
                    id: this.dataService.getSignInUser().user.uid,
                    name: this.dataService.getSignInUser().additionalUserInfo.profile.first_name,
                    photoUrl: this.dataService.getSignInUser().user.photoURL,
                    friends: [],
                    behavior: 0
                };
                this.firestore.createUser(this.user);
                this.dataService.userFromDatabase = this.user;
            }
            else {
                this.dataService.userFromDatabase = res;

            }
        });
    }
}

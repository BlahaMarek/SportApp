import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
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
import {take} from "rxjs/operators";

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
    user: User = {friends: [], id: "", name: "", photoUrl: ""};
    hasConnection = true;
    isOpen = true;

    constructor(
        private network: Network,
        private firestore: FirestoreService,
        private userService:UserService,
        private dataService: DataService,
        public navCtrl: NavController,
        private facebook: Facebook,
        private googlePlus: GooglePlus,
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
          this.dataService.userFromDatabase
          this.dataService.refreshAfterLogin = true;
          this.router.navigateByUrl('/tabs/tabs/tab1');
      }

    }
    fbLogin() {
        this.facebook.login(['public_profile', 'user_friends', 'email'])
            .then(res => {
                if (res.status === 'connected') {
                    console.log('pr1')

                    this.getUserDetail(res.authResponse.userID);
                } else {
                    console.log('pro')
                }
            })
            .catch(e => console.log('Error logging into Facebook', e));
    }

    getUserDetail(userid: any) {
        this.facebook.api('/' + userid + '/?fields=id,email,name,picture', ['public_profile'])
            .then(res => {
                console.log(res);
                this.setDataserviceUserFb2(res);
                this.createUserToDataabse();

                // this.createUserToDataabse().then((value => {
                //     console.log(value)
                // })).catch((err)=>{
                //     console.log(err)
                // });

            })
            .catch(e => {
                console.log(e);
            });
    }

    ionViewWillEnter() {
        this.isOpen = false;
    }

    get isConnected(): boolean {
        let connectionType = this.network.type;
        return connectionType && connectionType !== 'unknown' && connectionType !== 'none';
    }
    fakeUser(){
        this.user.id = 'user.user.uid';
        this.user.name = 'Lukas';
        this.user.photoUrl = 'https://graph.facebook.com/3118144761533679/picture';
        this.dataService.user = this.user;

        // this.setDataserviceUserFb(this.user);
        this.router.navigateByUrl('/tabs/tabs/tab1');
    }

    facebookLogin(): void {
        this.facebook.login(['email']).then( (response) => {
          const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);

          firebase.auth().signInWithCredential(facebookCredential)
              .then((user) => {


                // this.dataService.user = user;
                console.log(user);

                this.setDataserviceUserFb(user);


                this.dataService.logged = true;
                this.dataService.refreshAfterLogin = true;
                this.router.navigateByUrl('/tabs/tabs/tab1');
              })
              .catch((error) => {
                  this.presentToast("Prihlásenie neúspešné");
              });
    }).catch((error) => { console.log(error) });
  }

    googleSignIn() {
        this.googlePlus.login({

        })
            .then((res) => {
                this.setDataserviceUserGoogle(res);
                this.createUserToDataabse();
                this.dataService.logged = true;
                this.dataService.refreshAfterLogin = true;
                this.router.navigateByUrl('/tabs/tabs/tab1');
            })
            .catch(err => this.presentToast("Prihlásenie neúspešné"));
    }

    //aby sme ukladali usera v normalnom formate do dateservisu
    setDataserviceUserFb(user){
        this.user.id = user.user.uid;
        this.user.name = user.additionalUserInfo.profile.first_name;
        this.user.photoUrl = user.user.photoURL;
        this.dataService.user = this.user;
    }

    setDataserviceUserFb2(user){
        return new Promise((resolve, reject) => {
        this.user.id = user.id;
        this.user.name = user.name;
        this.user.photoUrl = user.picture.data.url;
        this.dataService.user = this.user;
        });
    }

    setDataserviceUserGoogle(user){
        console.log(user.user);
        this.user.id = user.userId;
        this.user.name = user.givenName;
        this.user.photoUrl = user.imageUrl;
        this.dataService.user = this.user;

        // "113961267337708956071"

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
            this.createUserToDataabse();
    }

    //skontroluje ci je user uz v databaze vytvoreny, ak nie vytvori, ak hej natiahne o nom udaje
    createUserToDataabse(){

        this.userService.getOneUser(this.dataService.getSignInUser().id).pipe(take(1)).subscribe(res=>{  //ak nenajde usera v databaze vytvori ho...
            if (res==undefined){
                this.user = {
                    id: this.dataService.getSignInUser().id,
                    name: this.dataService.getSignInUser().name,
                    photoUrl: this.dataService.getSignInUser().photoUrl,
                    friends: [],
                };
                this.firestore.createUser(this.user);
                this.dataService.userFromDatabase = this.user;
            }
            else {
                if (this.dataService.getSignInUser().photoUrl == undefined)
                {
                    this.dataService.user.photoUrl = null
                }
                                this.userService.updateUser(res.id, this.dataService.getSignInUser());
                                // this.dataService.user.photoUrl =
                                    this.dataService.userFromDatabase = res;

                this.dataService.userFromDatabase = res;
                this.dataService.userO=res;
            }

            localStorage.setItem("user", JSON.stringify(this.dataService.getUserFromDatabase()));
        });
        console.log(this.dataService.userFromDatabase)

    }
}

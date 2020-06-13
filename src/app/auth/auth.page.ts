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

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
    user: User={behavior: 0, friends: [], id: "", name: "", photoUrl: ""};
    hasConnection = true;


  constructor(private network: Network, private firestore: FirestoreService,private userService:UserService, private dataService: DataService,public navCtrl: NavController, private facebook: Facebook, private router: Router,public toastController: ToastController,
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
    get isConnected(): boolean {
        let connectionType = this.network.type;
        return connectionType && connectionType !== 'unknown' && connectionType !== 'none';
    }
  facebookLogin(): void {
    this.facebook.login(['email']).then( (response) => {
      const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(response.authResponse.accessToken);

      firebase.auth().signInWithCredential(facebookCredential)
          .then((success) => {
              console.log(success);
            this.dataService.user = success;

            localStorage.setItem("user", JSON.stringify(success))
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

    ionViewWillLeave(){
        if (this.dataService.logged == true){
            this.createUserToDataabse()
        }
        console.log("som in da ion view will leave");
    }

    createUserToDataabse(){

        this.userService.getOneUser(this.dataService.getSignInUser().user.uid).subscribe(res=>{  //ak nenajde usera v databaze vytvori ho...
            console.log(res);
            console.log("up je res");
            if (res==undefined){
                this.user = {
                    id: this.dataService.getSignInUser().user.uid,
                    name: this.dataService.getSignInUser().additionalUserInfo.profile.first_name,
                    photoUrl: this.dataService.getSignInUser().user.photoURL,
                    friends: [],
                    behavior: 0
                }
                this.firestore.createUser(this.user);
                this.dataService.userFromDatabase = this.user;
            }
            else {
                this.dataService.userFromDatabase = res;

            }
        });
    }

  onSubmitClick() {
      // this.dataService.logged = true; // prec ..iba pre vedecke ucely
      var user = {
          id: "1MUxrZRhP0Wsdad54w83Icw0y3k2",
          name : "Skusaim id z fb",
          photoUrl: "moj total skusobny url2",
          behaviorCount: 0,
          behavior: 0,
          skillRatingCount: 0,

      };
    this.dataService.refreshAfterLogin = true;
      this.userService.getOneUser(user.id).subscribe(res=>{ //toto vymazat..je to len na skusanie
          console.log(res);
          console.log(user + "before");
          console.log(user)
          if (res==undefined){ //ak nenajde usera v databaze vytvori ho...
            this.firestore.createUser(user);
          }
      });
      console.log("toto je user");
      console.log(user)
    this.router.navigateByUrl('/tabs/tabs/tab1');
  }


}

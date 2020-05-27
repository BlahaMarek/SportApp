import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Sport } from '../models/sport';
import * as firebase from 'firebase';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import {LoadingController, NavController, ToastController} from "@ionic/angular";
import {DataService} from "../data/data.service";
import { FirestoreService } from '../services/firestore.service';
import { User } from '../models/user';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  userProfile: any = null;
    isLoggedIn = false;
    users = { id: '', name: '', email: '', picture: { data: { url: '' } } };
  constructor(private dataService: DataService,public navCtrl: NavController,public loadingController: LoadingController, private facebook: Facebook, private router: Router,public toastController: ToastController,
    private fireStore: FirestoreService) {}

    ngOnInit(): void {
      // if (this.userProfile != null){
      //     this.router.navigateByUrl('/tabs/tabs/tab1');
      // }
        this.facebook.getLoginStatus()
            .then(res => {
                console.log(res.status);
                if (res.status === 'connect') {
                    this.isLoggedIn = true;
                } else {
                    this.isLoggedIn = false;
                }
            })
            .catch(e => console.log(e));
    }
    getUserDetail(userid: any) {
        this.facebook.api('/' + userid + '/?fields=id,email,name,picture', ['public_profile'])
            .then(res => {
                console.log(res);
                this.users = res;
            })
            .catch(e => {
                console.log(e);
            });
    }

   facebookLogin() {

       this.facebook.login(['public_profile', 'user_friends', 'email'])
           .then(res => {
               if (res.status === 'connected') {
                   this.isLoggedIn = true;
                   this.getUserDetail(res.authResponse.userID);
               } else {
                   this.isLoggedIn = false;
               }
           })
           .catch(e => console.log('Error logging into Facebook', e));











    // this.facebook.login(['email']).then( (response) => {
    //   const facebookCredential = firebase.auth.FacebookAuthProvider
    //       .credential(response.authResponse.accessToken);
    //
    //   firebase.auth().signInWithCredential(facebookCredential)
    //       .then((success) => {
    //         console.log("som v page" + JSON.stringify(success));
    //
    //         console.log(this.dataService.user);
    //         this.dataService.user = success;
    //         this.dataService.logged = true;
    //         this.dataService.refreshAfterLogin = true;
    //         this.presentToast("Úspešne prihlásený ako " + this.dataService.getSignInUser().user.displayName);
    //         this.router.navigateByUrl('/tabs/tabs/tab1');
    //         var user:User;
    //         user.id = this.dataService.getSignInUser().user.uid;
    //         user.name = this.dataService.getSignInUser().user.additionalUserInfo.profile.first_name;
    //         user.photoUrl = this.dataService.getSignInUser().user.user.photoURL;
    //         this.fireStore.createUser(user); // pridavam usera do firebasu
    //       })
    //       .catch((error) => {
    //         console.log("Firebase failure: " + JSON.stringify(error));
    //           this.presentToast("Prihlásenie neúspešné");
    //
    //       });
    //
    // }).catch((error) => { console.log(error) });
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

    var users:User[];
    var user:User = {
            id: "1MUxrZRhP0Wsdad54w83Icw0y3k2",
            name : "Lukas",
            photoUrl: "moj total skusobny url2",
            behaviorCount: 0,
            skillRatingCount: 0,
            
    };
    this.fireStore.readAllUsers().subscribe(all => {
      console.log("toto je all");
      console.log(all);
      const pouzivatek = all.find(pouzivatel => pouzivatel.id == user.id);

      this.dataService.setAllUsers(all);

      if(pouzivatek){
        console.log("pouzivatel uz je in da database");
      }
      else{
      this.fireStore.createUser(user); // pridavam usera do firebasu      
      }
    });
    
    
    this.dataService.refreshAfterLogin = true;
    this.router.navigateByUrl('/tabs/tabs/tab1');
  }


}

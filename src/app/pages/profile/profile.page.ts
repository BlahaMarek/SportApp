import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import {DataService} from "../../data/data.service";
import { FormBuilder, FormGroup } from '@angular/forms';
import {UserService} from "../../services/user.service";
import {ActivityRatingComponent} from "../../components/activities/activity-rating/activity-rating.component";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: any = {};

  userFromTable:any={}
  rating:number = 0;
  customForm: FormGroup;
  constructor(private router: Router,
              private fireAuth: AngularFireAuth,
              private dataService: DataService,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private modalController: ModalController) { }

  ngOnInit() {
    console.log(this.dataService.getSignInUser());
    this.user = this.dataService.getSignInUser();

    this.userService.getOneUser(this.user.user.uid).subscribe(res=>{
      this.userFromTable = res;
    });
    this.rating = this.userFromTable.behavior/this.userFromTable.behaviorCount;
    console.log(this.rating);

  }
  logout() {
    this.fireAuth.auth.signOut().then(() => {
      this.dataService.user = {};
      this.dataService.logged = false;
      this.dataService.refreshAfterLogin = false;
      this.router.navigateByUrl('/login');
    });
  }

  login() {
    this.router.navigateByUrl('/login');
  }
  rateUsers(){
    this.modalController
        .create({component: ActivityRatingComponent,
          componentProps:{
            usersId: this.userFromTable.friends,
            profile: true
          }

        })
        .then(modalEl => {
          console.log("som v tabe 1111  hore");
          modalEl.present();
          return modalEl.onDidDismiss();
        })
        .then(result => {

        });
  }

  get userPhoto() {
    if (!this.user || !this.user.user || !this.user.user.photoURL) {
      return "";
    }
    return this.user.user.photoURL + "?type=large";
  }
}

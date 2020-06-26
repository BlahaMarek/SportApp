import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import {DataService} from "../../data/data.service";
import { FormBuilder, FormGroup } from '@angular/forms';
import {UserService} from "../../services/user.service";
import {ActivityRatingComponent} from "../../components/activities/activity-rating/activity-rating.component";
import {ModalController} from "@ionic/angular";
import {RatingService} from "../../services/rating.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: any = {};

  userFromTable:any={}
  rating:number = 0;
  allRatings:any[] = [];
  customForm: FormGroup;

  ratingSport1:number[] = [];
  ratingSport2:number[] = [];
  ratingSport3:number[] = [];
  ratingSport4:number[] = [];
  ratingSport5:number[] = [];
  ratingSport6:number[] = [];
  ratingSport7:number[] = [];
  ratingSport8:number[] = [];
  ratingSport9:number[] = [];
  ratingSport10:number[] = [];



  constructor(private router: Router,
              private fireAuth: AngularFireAuth,
              private dataService: DataService,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private modalController: ModalController,
              private ratingService: RatingService) { }

  ngOnInit() {
    this.user = this.dataService.getSignInUser();
    this.userService.getOneUser(this.user.id).subscribe(res=>{
      this.userFromTable = res;
    });
    this.getRatings();
  }



  logout() {
    // this.fireAuth.auth.signOut().then(() => {
    //   this.dataService.user = {};
    //   this.dataService.logged = false;
    //   this.dataService.refreshAfterLogin = false;
    //   this.router.navigateByUrl('/login');
    // });
    localStorage.clear();
    this.router.navigate(['login']);
    this.dataService.user = {};
    this.dataService.logged = false;
    this.dataService.refreshAfterLogin = false;
  }

  login() {
    this.router.navigateByUrl('/login');
  }
  friends(){
    this.modalController
        .create({component: ActivityRatingComponent,
          componentProps:{
            usersId: this.userFromTable.friends,
            profile: true
          }

        })
        .then(modalEl => {
          modalEl.present();
          return modalEl.onDidDismiss();
        })
        .then(result => {

        });
  }

  countAverageRating(sportRating){
    var sum = 0;
    for (var i = 0; i<sportRating.length; i++){
      sum += sportRating[i];
    }
    return sum/sportRating.length;

  }


  getRatings(){
    this.ratingService.getAllRatingsByUser(this.user.id).subscribe(res =>{
      res.forEach(res2 => {
        switch (res2.idSportu) {
          case "1":
            this.ratingSport1.push(res2.rating);
            break;
          case "2":
            this.ratingSport2.push(res2.rating);
            break;
          case "3":
            this.ratingSport3.push(res2.rating);
            break;
            case "4":
              this.ratingSport4.push(res2.rating);
              break;
            case "5":
              this.ratingSport5.push(res2.rating);
              break;
            case "6":
              this.ratingSport6.push(res2.rating);
              break;
            case "7":
              this.ratingSport7.push(res2.rating);
              break;
            case "8":
              this.ratingSport8.push(res2.rating);
              break;
            case "9":
              this.ratingSport9.push(res2.rating);
              break;
        }
      });
    });
  }

  get userPhoto() {
    return this.user.photoUrl + "?type=large";
  }
}

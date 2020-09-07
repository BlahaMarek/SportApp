import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/user";
import {DataService} from "../../../data/data.service";
import {take} from "rxjs/operators";
import {FirestoreService} from "../../../services/firestore.service";
import {Rating} from "../../../models/rating";
import {RatingService} from "../../../services/rating.service";
import {VisitUserProfileComponent} from "../../../pages/visit-user-profile/visit-user-profile.component";
import {ActivityService} from "../../../services/activity.service";
import {Activity} from "../../../models/activity";
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-activity-rating',
  templateUrl: './activity-rating.component.html',
  styleUrls: ['./activity-rating.component.scss'],
})
export class ActivityRatingComponent implements OnInit {

  @Input() users: string[];
  @Input() usersId: string[];
  @Input() idAktivity: string;
  @Input() overdue: boolean;
  @Input() profile: boolean;
  @Input() idSportu: string;
  @Input() createdBy: string

  usersFromDatabase:User[] = [];
  usersRated:User[] = [];
  ratingsFromAktivity: any = [];
  ratingsUserBySportId: any = [];
  friendsFromProfile:User[] = [];
  loggedUser: any = {};
  finishDwonloading: boolean = true;
  creator: User;

  hodnotenyCreator:boolean = false;

  constructor(private ratingService: RatingService,
              private firestoreService: FirestoreService,
              private dataService: DataService,
              private userService: UserService,
              private modalController: ModalController,
              private activityService: ActivityService,
              public alertController: AlertController) { }
  ngOnInit() {
    var mojeUsersId = this.usersId
console.log(mojeUsersId)
    if(!this.profile) {
      //stahujem creatora aktivity
      this.userService.getOneUser(this.createdBy).pipe(take(1)).subscribe(res => {
        this.creator = res;
        this.findUserBehavior();
        // this.usersId.push(this.creator.id);
      });
    }

    this.loggedUser = this.dataService.getSignInUser();
    if (this.profile) { // ak pridem z profilu
      for (var i = 0; i < mojeUsersId.length; i++) {
        this.userService.getOneUser(this.usersId[i]).pipe(take(1)).subscribe(res => {
          this.friendsFromProfile.push(res);
        });
      }
    this.finishDwonloading = false;
    }
    // this.loggedUser.user.uid
    // 1MUxrZRhP0Wsdad54w83Icw0y3k2
    else {       // ak pridem from da aktivity
      this.ratingService.getRatingsById(this.idAktivity,this.loggedUser.id).pipe(take(1)).subscribe(res => { //nacitam ratingy z aktivity kde je id lognuteho pouzi..
        this.ratingsFromAktivity = res;
      });
      for (var i = 0; i < mojeUsersId.length; i++) {
        this.userService.getOneUser(mojeUsersId[i]).pipe(take(1)).subscribe(res => {
          if (this.ratingsFromAktivity.length > 0) {
            var bolHodnoteny = this.ratingsFromAktivity.filter(rat => rat.idHraca.includes(res.id))
            if (bolHodnoteny.length == 0) { //zistim ci ho uz pred tym hodnotil
              this.usersFromDatabase.push(res); // sem si pushnem pouzivatelov z aktivity,
            } else {
              res.behavior = bolHodnoteny[0].rating;
              this.usersRated.push(res); //ak ho hodnotil pushnem ho sem
            }
          } else {
            this.usersFromDatabase.push(res);
          }
        });
        this.ratingService.getRatingsByUser(mojeUsersId[i], this.idSportu).pipe(take(1)).subscribe(res => {
          this.ratingsUserBySportId.push(res);
          var hodnotenie = 0;
          for (var i =0; i< res.length; i++){
            hodnotenie += res[i].rating;
          }
          hodnotenie = hodnotenie / res.length;

          if (!this.overdue) {
          var nehodnoteny = this.usersFromDatabase.filter(user => user.id == mojeUsersId[i]);
          var hodnoteny = this.usersRated.filter(user => user.id == mojeUsersId[i]);


            if (nehodnoteny.length > 0) {
              this.usersFromDatabase[this.usersFromDatabase.length - 1].behavior = hodnotenie;

            }
            if (hodnoteny.length > 0) {
              this.usersRated[this.usersRated.length - 1].behavior = hodnotenie;
            }

          }
          this.finishDwonloading = false;
        });

      }
      if (mojeUsersId.length == 0){
        this.finishDwonloading = false;
      }
    }


  }
  findUserBehavior(){
    this.ratingService.getRatingsByUser(this.createdBy,this.idSportu).pipe(take(1)).subscribe(res => {
      var hodnotenie = 0;
      for (var i =0; i< res.length; i++){
        hodnotenie += res[i].rating;
      }
      hodnotenie = hodnotenie / res.length;
      console.log(hodnotenie)
      console.log(res.length)
      if (res.length == 0){
        hodnotenie = 0;
      }
      if (!this.overdue){

        this.creator.behavior = hodnotenie;
      }
      console.log(this.overdue)

      console.log(this.loggedUser)
      console.log(this.ratingsFromAktivity)
      var bolHodnoteny = this.ratingsFromAktivity.filter(rat => rat.isKritika.includes(this.loggedUser.id));
      console.log(bolHodnoteny)
      bolHodnoteny.filter(creator => creator.idHraca.includes(this.createdBy));
      console.log(bolHodnoteny)
      if (bolHodnoteny.length == 0) { //zistim ci ho uz pred tym hodnotil
        this.hodnotenyCreator = false;
        console.log(bolHodnoteny)
      } else {
        this.hodnotenyCreator = true; //ak ho hodnotil pushnem ho sem
        this.creator.behavior = bolHodnoteny[0].rating
        console.log(bolHodnoteny)
      }

    });


  }

  checkFriends(friendsId:string){
    var pro = this.dataService.getUserFromDatabase().friends.filter(fr => fr == friendsId);
    if (pro.length>0){
      return true
    }else{
      return false;
    }
  }

  logRatingChange(id:string ,rating) {
    let userr: User = this.usersFromDatabase.find(user => user.id == id);
    for (var i = 0; i < this.usersFromDatabase.length; i++) {
      if (this.usersFromDatabase[i].id == id) {
        this.usersFromDatabase.splice(i, 1);
        break;
      }
    }
    console.log(userr)
    if (userr == undefined) {
      userr = this.creator
    }
    var ratingUkladam: Rating = {
      idAktivity: this.idAktivity,
      idHraca: userr.id,
      isKritika: this.dataService.getSignInUser().id,
      rating: rating,
      idSportu: this.idSportu
    }

    if (userr.id != this.createdBy) {
      this.usersRated.push(userr);
      this.firestoreService.createRating(ratingUkladam);
      var nahodimRating = this.usersFromDatabase.find(user => user.id == id);

      if (nahodimRating==undefined){
        nahodimRating = this.usersRated.find(user => user.id == id);
      }
      console.log(nahodimRating)
      nahodimRating.behavior = rating;
    }
    else if (userr.id == this.createdBy){
      this.firestoreService.createRating(ratingUkladam);
      this.hodnotenyCreator = true;
      this.creator.behavior = rating;
    }

  }

  async presentAlertConfirm(name,userId) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Odstránenie!',
      message: 'Naozaj chcete odstrániť používateľa <strong>'+name+'</strong> z aktivity?',
      buttons: [
        {
          text: 'Zrušiť',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {

          }
        }, {
          text: 'Odstrániť',
          handler: () => {
            console.log('Confirm Okay');
            this.deteleUser(userId);
          }
        }
      ]
    });

    await alert.present();
  }


  addFriend(friend){
    this.dataService.getUserFromDatabase().friends.push(friend);
    this.userService.updateUser(this.loggedUser.id, this.dataService.getUserFromDatabase());
  }

  deleteFriend(friend){ //vymaze priatela ale v liste ostane
    this.userService.removeFriend(friend);
  }

  deteleUser(playerId:string){
    let activity: Activity = this.activityService.getActivityById(this.idAktivity);
    let updated: Activity = activity;
    for (var i = 0 ; i< updated.bookedBy.length ; i++){
      if (updated.bookedBy[i] == playerId){
        updated.bookedBy.splice(i,1);
        this.usersFromDatabase = this.usersFromDatabase.filter(user => user.id != playerId);
        break;
      }
    }
    this.activityService.updateActivity(activity,updated);


  }


  deleteFriendFomFriendList(friendId){ // toto mam pre vymazanie z priatela profilu...aby aj zmizol z listu
    this.userService.removeFriend(friendId);
    for (var i= 0 ; i<this.friendsFromProfile.length;i++){
      if (this.friendsFromProfile[i].id == friendId){
        this.friendsFromProfile.splice(i,1);
        break;
      }
    }
  }

  onCancel() {
    this.modalController.dismiss({message: 'ActivityRating closed'}, 'cancel');
  }
  visitProfile(user: User){
    this.modalController
        .create({component: VisitUserProfileComponent,
          componentProps:{
            user: user
          }

        })
        .then(modalEl => {
          modalEl.present();
          return modalEl.onDidDismiss();
        })
        .then(result => {

        });
  }

}

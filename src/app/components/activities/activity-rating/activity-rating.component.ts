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

  usersFromDatabase:User[] = [];
  usersRated:User[] = [];
  ratingsFromAktivity: any = [];
  ratingsUserBySportId: any = [];
  friendsFromProfile:User[] = [];
  loggedUser: any = {};
  constructor(private ratingService: RatingService,private firestoreService: FirestoreService,private dataService: DataService,private userService: UserService, private modalController: ModalController) { }
  // this.loggedUser.user.uid
  ngOnInit() {
    this.loggedUser = this.dataService.getSignInUser();
    if (this.profile) { // ak pridem z profilu
      for (var i = 0; i < this.usersId.length; i++) {
        this.userService.getOneUser(this.usersId[i]).pipe(take(1)).subscribe(res => {
          this.friendsFromProfile.push(res);
        });


      }

    }
    // 1MUxrZRhP0Wsdad54w83Icw0y3k2
    else {       // ak pridem from da aktivity
      this.ratingService.getRatingsById(this.idAktivity, this.loggedUser.user.uid).pipe(take(1)).subscribe(res => { //nacitam ratingy z aktivity kde je id lognuteho pouzi..
        this.ratingsFromAktivity = res;
      });



      for (var i = 0; i < this.usersId.length; i++) {
        this.userService.getOneUser(this.usersId[i]).pipe(take(1)).subscribe(res => {
          if (this.ratingsFromAktivity.length > 0) {
            var bolHodnoteny = this.ratingsFromAktivity.filter(rat => rat.idHraca.includes(res.id))
            if (bolHodnoteny.length == 0) { //zistim ci ho uz pred tym hodnotil
              this.usersFromDatabase.push(res); // sem si pushnem pouzivatelov z aktivity,
            } else {
              this.usersRated.push(res); //ak ho hodnotil pushnem ho sem
            }
          } else {
            this.usersFromDatabase.push(res);
          }
        });
        this.ratingService.getRatingsByUser(this.usersId[i], this.idSportu).pipe(take(1)).subscribe(res => {
          this.ratingsUserBySportId.push(res);
          var hodnotenie = 0;
          for (var i =0; i< res.length; i++){
            hodnotenie += res[i].rating;
          }
          hodnotenie = hodnotenie / res.length;
          this.usersFromDatabase[this.usersFromDatabase.length-1].behavior = hodnotenie;

        });
      }

    }

  }

  checkFriends(friendsId:string){
    console.log("userFromDatabase");
    console.log(this.dataService.getUserFromDatabase());
    var pro = this.dataService.getUserFromDatabase().friends.filter(fr => fr == friendsId);
    if (pro.length>0){
      return true
    }else{
      return false;
    }

  }

  logRatingChange(id:string ,rating){
    let userr: User = this.usersFromDatabase.find(user => user.id == id);
    userr.behavior = userr.behavior+rating;
    userr.behaviorCount++;
    for (var i= 0 ; i<this.usersFromDatabase.length;i++){
      if (this.usersFromDatabase[i].id == id){
        this.usersFromDatabase.splice(i,1);
        break;
      }
    }
    var ratingUkladam:Rating = {
      idAktivity: this.idAktivity,
      idHraca: userr.id,
      isKritika: "1MUxrZRhP0Wsdad54w83Icw0y3k2",
      rating: rating,
      idSportu: this.idSportu
  }

  this.usersRated.push(userr);
    this.firestoreService.createRating(ratingUkladam);
  }


  addFriend(friend){
    console.log("toto je whaaaat");
    console.log(this.ratingsUserBySportId);
    var user: User = this.dataService.getUserFromDatabase().id;

    console.log(this.dataService.getUserFromDatabase().id);
    console.log("toto je user");
    console.log("toto je friend");
    console.log(friend);
    this.dataService.getUserFromDatabase().friends.push(friend);
    this.userService.updateUser(this.loggedUser.user.uid, this.dataService.getUserFromDatabase());
  }

  deleteFriend(friend){ //vymaze priatela ale v liste ostane
    this.userService.removeFriend(friend);
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

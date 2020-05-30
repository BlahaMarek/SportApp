import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/user";
import {DataService} from "../../../data/data.service";
import {take} from "rxjs/operators";
import {FirestoreService} from "../../../services/firestore.service";
import {Rating} from "../../../models/rating";
import {RatingService} from "../../../services/rating.service";

@Component({
  selector: 'app-activity-rating',
  templateUrl: './activity-rating.component.html',
  styleUrls: ['./activity-rating.component.scss'],
})
export class ActivityRatingComponent implements OnInit {

  @Input() users: string[];
  @Input() usersId: string[];
  @Input() idAktivity: string;
  usersFromDatabase:User[] = [];
  usersRated:User[] = [];
  ratingsFromAktivity: any = [];
  loggedUser: any = {};
  constructor(private ratingService: RatingService,private firestoreService: FirestoreService,private dataService: DataService,private userService: UserService, private modalController: ModalController) { }

   ngOnInit() {
     this.loggedUser = this.dataService.getSignInUser();
     this.ratingService.getRatingsById(this.idAktivity,this.loggedUser.user.uid).pipe(take(1)).subscribe(res => { //nacitam ratingy z aktivity kde je id lognuteho pouzi..
       this.ratingsFromAktivity = res;
     });

     for (var i=0; i<this.usersId.length;i++){
       if (this.usersId[i] != this.dataService.getSignInUser().id){
         this.userService.getOneUser(this.usersId[i]).pipe(take(1)).subscribe(res=>{
           if (this.ratingsFromAktivity.length>0) {
             var bolHodnoteny = this.ratingsFromAktivity.filter(rat => rat.idHraca.includes(res.id))
             if (bolHodnoteny.length == 0) { //zistim ci ho uz pred tym hodnotil//o 3 riadku povyse
               this.usersFromDatabase.push(res); // sem si pushnem pouzivatelov z aktivity, okrem lognuteho
             }
             else {
               this.usersRated.push(res);
             }
           }else {
             this.usersFromDatabase.push(res);
           }
         });
       }
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
      isKritika: this.loggedUser.user.uid,
      rating: rating

  }
  this.usersRated.push(userr);
    this.userService.updateUser(id, userr);
    this.firestoreService.createRating(ratingUkladam);
  }

  addFriend(id:string ,friend){
    var user: User = this.usersFromDatabase.find(user => user.id == id);
    if (user == undefined) {
      var user: User = this.usersRated.find(user => user.id == id);
      console.log(user);
      user.friends.push(friend);
      this.userService.updateUser(id, user);
      return;
    }
    user.friends.push(friend);
    this.userService.updateUser(id, user);


  }



  onCancel() {
    this.modalController.dismiss({message: 'ActivityRating closed'}, 'cancel');
  }

}

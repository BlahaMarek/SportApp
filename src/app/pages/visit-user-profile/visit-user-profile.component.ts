import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../models/user";
import {ModalController} from "@ionic/angular";
import {DataService} from "../../data/data.service";
import {UserService} from "../../services/user.service";
import {RatingService} from "../../services/rating.service";

@Component({
  selector: 'app-visit-user-profile',
  templateUrl: './visit-user-profile.component.html',
  styleUrls: ['./visit-user-profile.component.scss'],
})
export class VisitUserProfileComponent implements OnInit {
  @Input() user: User;
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

  allRatings:any;




  constructor(private ratingService: RatingService, private userService: UserService,private dataService: DataService, private modalController: ModalController) { }

  ngOnInit() {
    this.getRatings();
  }

  onCancel() {
    this.modalController.dismiss({message: 'UserComponent closed'}, 'cancel');
  }

  checkFriends(){
    var pro = this.dataService.getUserFromDatabase().friends.filter(fr => fr == this.user.id);
    if (pro.length>0){
      return true
    }else{
      return false;
    }
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
      this.allRatings = res;
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


  addFriend(){
    var user: User = this.dataService.getUserFromDatabase().id; // lebo toto proste nejde
    console.log(user)
    this.dataService.getUserFromDatabase().friends.push(this.user.id);
    this.userService.updateUser(this.dataService.getUserFromDatabase().id, this.dataService.getUserFromDatabase());
  }

  deleteFriend(){
    this.userService.removeFriend(this.user.id);
  }

  get userPhoto() {
    return this.user.photoUrl + "?type=large";
  }

}

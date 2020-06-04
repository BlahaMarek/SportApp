import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../models/user";
import {ModalController} from "@ionic/angular";
import {DataService} from "../../data/data.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-visit-user-profile',
  templateUrl: './visit-user-profile.component.html',
  styleUrls: ['./visit-user-profile.component.scss'],
})
export class VisitUserProfileComponent implements OnInit {
  @Input() user: User;
  rating: number = 0
  constructor(private userService: UserService,private dataService: DataService, private modalController: ModalController) { }

  ngOnInit() {
    this.rating = this.user.behavior / this.user.behaviorCount;
    console.log(this.rating);

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

  addFriend(){
    var user: User = this.dataService.getUserFromDatabase().id; // lebo toto proste nejde
    console.log(user)
    this.dataService.getUserFromDatabase().friends.push(this.user.id);
    this.userService.updateUser(this.dataService.getUserFromDatabase().id, this.dataService.getUserFromDatabase());
  }

  deleteFriend(){
    this.userService.removeFriend(this.user.id);
  }

}

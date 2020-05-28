import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/user";
import {DataService} from "../../../data/data.service";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-activity-rating',
  templateUrl: './activity-rating.component.html',
  styleUrls: ['./activity-rating.component.scss'],
})
export class ActivityRatingComponent implements OnInit {

  @Input() users: string[];
  @Input() usersId: string[];
  usersFromDatabase:User[] = [];

  constructor(private dataService: DataService,private userService: UserService, private modalController: ModalController) { }

  ngOnInit() {

    for (var i=0; i<this.usersId.length;i++){
      if (this.usersId[i] != this.dataService.getSignInUser().id){
        this.userService.getOneUser(this.usersId[i]).pipe(take(1)).subscribe(res=>{
          this.usersFromDatabase.push(res);
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
    this.userService.updateUser(id, userr);
  }

  onCancel() {
    this.modalController.dismiss({message: 'ActivityRating closed'}, 'cancel');
  }

}

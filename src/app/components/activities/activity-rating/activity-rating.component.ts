import { take } from 'rxjs/operators';
import { UserService } from './../../../services/user.service';
import { forEach } from '@angular-devkit/schematics';
import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import { User } from 'src/app/models/user';
import { DataService } from 'src/app/data/data.service';

@Component({
  selector: 'app-activity-rating',
  templateUrl: './activity-rating.component.html',
  styleUrls: ['./activity-rating.component.scss'],

})
export class ActivityRatingComponent implements OnInit {

  @Input() users: string[];
  @Input() usersId: string[];
  userNaporiadok = [];




  constructor(private modalController: ModalController, private dataService: DataService, private userService: UserService) { }
  currentRate = 0;
  allUsers: User[];



  ngOnInit() {
    this.allUsers = this.dataService.getAllUsers();
    console.log(this.allUsers);
    this.allUsers = this.allUsers.filter(f => this.usersId.includes(f.id)); // vyfiltruje len userov, ktori  boli v danej aktivite

  }

  onCancel() {
    this.modalController.dismiss({message: 'ActivityDetail closed'}, 'cancel');
  }

  logRatingChange(id:string ,rating){
    console.log("changed rating: ",rating);
    let userr: User = this.allUsers.find(user => user.id == id);

    console.log(userr);
    userr.behavior = userr.behavior+rating;
    userr.behaviorCount++;
    console.log("Priemerne hodnotenie je "  + userr.behavior/userr.behaviorCount);
    for (var i= 0 ; i<this.allUsers.length;i++){
      if (this.allUsers[i].id == id){
        this.allUsers.splice(i,1);
        break;
      }
    }
    this.userService.updateTask(id, userr);
}

}

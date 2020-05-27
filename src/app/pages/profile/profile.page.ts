import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import {DataService} from "../../data/data.service";
import {User} from "../../models/user";
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: any = {};
  userFromAnotherTable: any= {};
  averageRating: number;
  constructor(private router: Router,
              private fireAuth: AngularFireAuth,
              private dataService: DataService) { }

  ngOnInit() {
    this.user = this.dataService.getSignInUser();

    this.userFromAnotherTable = this.dataService.getAllUsers();
    this.userFromAnotherTable = this.userFromAnotherTable.filter(f => this.user.includes(f.id));
    this.averageRating = this.userFromAnotherTable.behavior / this.userFromAnotherTable.behaviorCount;
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

}

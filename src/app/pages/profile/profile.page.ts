import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import {DataService} from "../../data/data.service";
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: any = {};
  constructor(private router: Router,
              private fireAuth: AngularFireAuth,
              private dataService: DataService) { }

  ngOnInit() {
    this.user = this.dataService.getSignInUser();
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

  get userPhoto() {
    if (!this.user || !this.user.user || !this.user.user.photoURL) {
      return "";
    }
    return this.user.user.photoURL + "?type=large";
  }
}

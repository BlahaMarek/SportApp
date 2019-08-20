import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Sport } from '../models/sport';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  sportOptions: Sport[];
  constructor(private router: Router) { }

  ngOnInit() {
  }

  onSubmitClick() {
    this.router.navigateByUrl('/tabs/tabs/tab1');
  }
}

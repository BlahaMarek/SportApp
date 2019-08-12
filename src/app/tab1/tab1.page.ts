import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  sport = '';
  pocet = '';
  miesto = '';

  sport1 = '';
  pocet1 = '';
  miesto1 = '';



  constructor() {}


  refresh() {
    this.sport1 = this.sport;
    this.pocet1 = this.pocet;
    this.miesto1 = this.miesto;

  }
}

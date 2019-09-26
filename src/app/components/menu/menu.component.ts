import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IonImg} from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  // @ts-ignore
  @ViewChild('sk') sk: ElementRef;
  // @ts-ignore
  @ViewChild('en') en: ElementRef;
  constructor() { }

  ngOnInit() {
    console.log(this.sk);
    console.log(this.en);
    this.sk.nativeElement.className = 'active';
  }

  onLogout() {
    console.log("Logout");
  }

  onLanguageIconClicked(lang: String) {
    if (lang === 'sk') {
      console.log('SK clicked');
      console.log(this.sk);
      this.sk.nativeElement.className = 'active';
      this.en.nativeElement.className = 'none';
    }
    else {
      console.log('EN clicked');
      this.sk.nativeElement.className = 'none';
      this.en.nativeElement.className = 'active';
    }
  }
}

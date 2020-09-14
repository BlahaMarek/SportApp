import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import { Network } from '@ionic-native/network/ngx';
import {ToastController} from "@ionic/angular";
import {EventService} from "../services/event.service";
import {DataService} from "../data/data.service";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit{
  disconnectSubscription: Subscription = null;
  connectSubscription: Subscription = null;
  constructor(private network: Network, public toastController: ToastController, private dataService: DataService) {}

  ngOnInit() {
    this.dataService.internet = true;
     this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
       this.presentToast("Žiadne pripojenie k internetu");
       this.dataService.internet = false;
     });
    this.connectSubscription = this.network.onConnect().subscribe(() => {
      // this.presentToast("Online");
      this.dataService.internet = true;
    });
  }

  async presentToast(message:any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      color: 'medium'
    });
    toast.present();
  }
}

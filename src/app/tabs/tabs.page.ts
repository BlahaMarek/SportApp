import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import { Network } from '@ionic-native/network/ngx';
import {ToastController} from "@ionic/angular";
import {EventService} from "../services/event.service";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit{
  disconnectSubscription: Subscription = null;

  constructor(private network: Network, public toastController: ToastController, private eventService: EventService) {}

  ngOnInit() {
     this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
       this.presentToast("Žiadne pripojenie k internetu");
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

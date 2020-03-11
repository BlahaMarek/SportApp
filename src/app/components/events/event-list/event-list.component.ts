import {Component, Input, OnInit} from '@angular/core';
import {Activity} from "../../../models/activity";
import {Sport} from "../../../models/sport";
import {ActivityService} from "../../../services/activity.service";
import {ModalController, ToastController} from "@ionic/angular";
import {DataService} from "../../../data/data.service";
import {AuthService} from "../../../auth/auth.service";
import {ActivityDetailComponent} from "../../activities/activity-detail/activity-detail.component";
import {EventService} from "../../../services/event.service";
import {EventDetailComponent} from "../event-detail/event-detail.component";

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit {

  @Input() filteredList: Activity[];
  sportOptions: Sport[] = [];

  constructor(
      private eventService: EventService,
      private modalController: ModalController,
      private toastController: ToastController,
      private dataService: DataService,
      private authService: AuthService
  ) {
  }

  ngOnInit() {
  }

  onActivityClicked(id: string) {
    console.log("rit a aktivita omfg" + id);
    var authService = this.authService.userIdAuth;
    this.modalController
        .create({
          component: EventDetailComponent,
          componentProps: {
            selectedActivity: this.eventService.getEventById(id),
            bookable: !(this.eventService.getEventById(id).createdBy === this.authService.userIdAuth),
            reserved: (this.eventService.getEventById(id).bookedBy.find(function (prihlaseny) {
              return prihlaseny.includes(authService)

            })),
            overdue: (new Date(this.eventService.getEventById(id).date).getTime() < new Date().getTime())
          }
        })
        .then(modalEl => {
          modalEl.present();
          return modalEl.onDidDismiss();
        })
        .then(result => {
          console.log(result);
        });
  }



  getCssClass(activity: Activity) {
    return "item-content " + this.dataService.getSportIconByValue(activity.sport);
  }
}


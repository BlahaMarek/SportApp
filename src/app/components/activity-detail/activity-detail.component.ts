import {Component, Input, OnInit} from '@angular/core';
import {Activity} from '../../models/activity';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.scss'],
})
export class ActivityDetailComponent implements OnInit {
  @Input() selectedActivity: Activity;

  constructor(
      private modalController: ModalController,
  ) { }

  ngOnInit() {}

  onCancel() {
    this.modalController.dismiss({message: 'ActivityDetail closed'}, 'cancel');
  }

}

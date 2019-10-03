import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MenuController, ModalController, ToastController} from '@ionic/angular';
import {ActivityNewComponent} from '../../components/activity-new/activity-new.component';
import {LanguageService} from '../../services/language.service';
import {Activity} from '../../models/activity';
import {ActivityService} from '../../services/activity.service';
import {AuthService} from '../../auth/auth.service';
import {DataService} from '../../data/data.service';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
    // @ts-ignore
    @ViewChild('others') others: ElementRef;
    activityList: Activity[];
    activityListByUser: Activity[];
    filteredList: Activity[];
    sportOptions: any;
    segment: any;
    constructor(
        public zone: NgZone,
        private fb: FormBuilder,
        private modalController: ModalController,
        private toastController: ToastController,
        private languageService: LanguageService,
        private activityService: ActivityService,
        private authService: AuthService,
        private dataService: DataService,
    ) {
        this.segment = "others";
        this.sportOptions = dataService.getSportsSk();
        this.initApp();
    }

    ngOnInit() {
        this.activityService.activities$.subscribe(list => {
            this.activityList = list;
            this.activityList = this.activityList.sort((x, y) => (x.topActivity === y.topActivity) ? 0 : x.topActivity ? -1 : 1);
            this.filteredList = this.activityList.filter(activity => ((activity.createdBy !== this.authService.userIdAuth ) && (activity.peopleCount > activity.bookedBy.length) && !activity.bookedBy.includes(this.authService.userIdAuth)));
        });
    }

    initApp() {
        this.languageService.setInitialAppLanguage();
    }

    onFilterUpdate(event: CustomEvent) {
        if (event.detail.value === 'others') {
            this.activityListByUser = this.activityList.filter(activity => ((activity.createdBy !== this.authService.userIdAuth ) && (activity.peopleCount > activity.bookedBy.length) && !activity.bookedBy.includes(this.authService.userIdAuth)));
            this.filteredList = this.activityListByUser;
        } else if (event.detail.value === 'mine') {
            this.activityListByUser = this.activityList.filter(activity => activity.createdBy === this.authService.userIdAuth);
            this.filteredList = this.activityListByUser;
        }
    }

    onSearchUpdate(event: CustomEvent) {
        if (event.detail.value === '') {
            this.filteredList = this.activityListByUser;
            return;
        }
        this.filteredList = this.activityListByUser.filter(activity => this.dataService.getSportNameByValue(activity.sport).toUpperCase().includes(event.detail.value.toUpperCase()));
    }

    onFabClicked(event: MouseEvent) {
        alert('Sem pojde filter !');
    }

    presentModal() {
        this.modalController
            .create({component: ActivityNewComponent})
            .then(modalEl => {
                this.segment = "others";
                modalEl.present();
                return modalEl.onDidDismiss();
            })
            .then(result => {
                console.log(result);

                if (result.role !== 'cancel') {
                    this.presentToast();
                }
            });
    }
    async presentToast() {
        const toast = await this.toastController.create({
            message: 'Aktivita bola úspešne pridaná.',
            duration: 2000,
            color: 'medium'
        });
        toast.present();
    }
}

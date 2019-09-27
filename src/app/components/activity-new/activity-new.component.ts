import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {ActivityService} from '../../services/activity.service';
import {Activity} from '../../models/activity';
import {DataService} from '../../data/data.service';
import {Sport} from '../../models/sport';
import {AuthService} from '../../auth/auth.service';


@Component({
    selector: 'app-activity-new',
    templateUrl: './activity-new.component.html',
    styleUrls: ['./activity-new.component.scss'],
})
export class ActivityNewComponent implements OnInit {
    sportOptions: Sport[] = [];
    private objekt: any;

    constructor(
        private fb: FormBuilder,
        private modalController: ModalController,
        private activityService: ActivityService,
        private dataService: DataService,
        private authService: AuthService,
        public zone: NgZone,

    ) {
        this.sportOptions = this.dataService.getSportsSk();
        // @ts-ignore
        this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
        this.autocomplete = { input: '' };
        this.autocompleteItems = [];
    }

    // @ts-ignore
    GoogleAutocomplete: google.maps.places.AutocompleteService;
    autocomplete: { input: string; };
    autocompleteItems: any[];
    location: any;
    placeid: any;
    activityForm = this.fb.group({
        peopleCount: ['', Validators.required],
        place: ['', Validators.required],
        topActivity: [false],
        date: ['', Validators.required],
        sport: this.fb.group({
            sportType: ['', Validators.required],
        }),
    });

    ngOnInit() {
    }

    onCancel() {
        this.modalController.dismiss({message: 'Close new activity!'}, 'cancel');
    }

    onFormSubmit() {
        this.activityService.addActivity(this.assignValueToActivity());
        this.modalController.dismiss({message: 'Add new activity!'}, 'add');
    }

    assignValueToActivity(): Activity {
        return{
            id: this.activityService.allActivitiesCount + 1,
            sport: {
                label: this.dataService.getSportNameByValue(this.activityForm.get('sport.sportType').value),
                value: this.activityForm.get('sport.sportType').value,
                tag: 1,
                userId: this.authService.userIdAuth
            },
            topActivity: this.activityForm.get('topActivity').value,
            place: this.activityForm.get('place').value,
            peopleCount: this.activityForm.get('peopleCount').value,
            date: this.activityForm.get('date').value
        };
    }
    updateSearchResults() {
        if (this.autocomplete.input === '') {
            this.autocompleteItems = [];
            return;
        }
        this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
            (predictions, status) => {
                this.autocompleteItems = [];
                this.zone.run(() => {
                    predictions.forEach((prediction) => {
                        this.autocompleteItems.push(prediction);
                    });
                });
            });
    }
    selectSearchResult(item) {
        // let place: google.maps.places.PlaceResult = this.GoogleAutocomplete.getPlacePredictions();
        console.log(item);
        this.location = item;
        this.placeid = this.location.place_id;
        console.log(this.placeid);
        JSON.stringify(item);   // tu potrebujem priradit vyber mesta po kliknuti, v iteme je object a ja potrebujem item.description
        this.autocomplete.input = JSON.stringify(item, ['description']);
        this.objekt = JSON.parse(this.autocomplete.input);
        this.autocomplete.input = this.objekt.description;
        for (let i = 0; i < 6; i++) {
            this.autocompleteItems.pop();
        }
    }
}

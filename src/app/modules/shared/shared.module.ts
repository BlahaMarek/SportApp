import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivityDetailComponent} from '../../components/activities/activity-detail/activity-detail.component';
import {ActivityNewComponent} from '../../components/activities/activity-new/activity-new.component';
import {ActivityListComponent} from '../../components/activities/activity-list/activity-list.component';
// import {ActivityRatingComponent} from '../../components/activities/activity-rating/activity-rating.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EventNewComponent} from "../../components/events/event-new/event-new.component";
import {EventListComponent} from "../../components/events/event-list/event-list.component";
import {EventDetailComponent} from "../../components/events/event-detail/event-detail.component";

@NgModule({
    declarations: [
        ActivityDetailComponent,
        ActivityNewComponent,
        ActivityListComponent,
        EventNewComponent,
        EventDetailComponent,
        EventListComponent,

    ],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        ActivityDetailComponent,
        ActivityNewComponent,
        ActivityListComponent,
        EventNewComponent,
        EventListComponent,
        EventDetailComponent
    ],
    entryComponents: [EventNewComponent,EventDetailComponent]
})
export class SharedModule {
}

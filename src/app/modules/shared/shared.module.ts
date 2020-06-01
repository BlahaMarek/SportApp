import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivityDetailComponent} from '../../components/activities/activity-detail/activity-detail.component';
import {ActivityNewComponent} from '../../components/activities/activity-new/activity-new.component';
import {ActivityListComponent} from '../../components/activities/activity-list/activity-list.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EventNewComponent} from "../../components/events/event-new/event-new.component";
import {EventListComponent} from "../../components/events/event-list/event-list.component";
import {EventDetailComponent} from "../../components/events/event-detail/event-detail.component";
import {FilterComponent} from "../../components/filter/filter.component";
import {AppModule} from "../../app.module";
import {FilterPipe} from "../../pipes/filter.pipe";
import {VisitUserProfileComponent} from "../../pages/visit-user-profile/visit-user-profile.component";

@NgModule({
    declarations: [
        ActivityDetailComponent,
        ActivityNewComponent,
        ActivityListComponent,
        EventNewComponent,
        EventDetailComponent,
        EventListComponent,
        // VisitUserProfileComponent,
        FilterComponent,
        FilterPipe,
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
        EventDetailComponent,
        FilterComponent,
        FilterPipe
    ],
    entryComponents: [EventNewComponent,EventDetailComponent,FilterComponent]
})
export class SharedModule {
}

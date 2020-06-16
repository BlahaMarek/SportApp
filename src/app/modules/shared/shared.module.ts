import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivityDetailComponent} from '../../components/activities/activity-detail/activity-detail.component';
import {ActivityNewComponent} from '../../components/activities/activity-new/activity-new.component';
import {ActivityListComponent} from '../../components/activities/activity-list/activity-list.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
        EventDetailComponent,
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
        EventDetailComponent,
        FilterComponent,
        FilterPipe
    ],
    entryComponents: [EventDetailComponent]
})
export class SharedModule {
}

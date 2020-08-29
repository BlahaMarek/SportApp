import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Tab3Page} from './tab3.page';
import {SharedModule} from '../../modules/shared/shared.module';
import {TranslateModule} from "@ngx-translate/core";
import {EventDetailComponent} from "../../components/events/event-detail/event-detail.component";
import {ActivityNewComponent} from "../../components/activities/activity-new/activity-new.component";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([{path: '', component: Tab3Page}]),
        TranslateModule,
        SharedModule,
    ],
    declarations: [
        Tab3Page,
    ],
    entryComponents: [
        EventDetailComponent,
        ActivityNewComponent
    ]
})
export class Tab3PageModule {
}

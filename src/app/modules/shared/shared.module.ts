import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivityDetailComponent} from '../../components/activity-detail/activity-detail.component';
import {ActivityNewComponent} from '../../components/activity-new/activity-new.component';
import {ActivityListComponent} from '../../components/activity-list/activity-list.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
    declarations: [
        ActivityDetailComponent,
        ActivityNewComponent,
        ActivityListComponent,
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
    ]
})
export class SharedModule {
}

import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Tab1Page} from './tab1.page';
import {ActivityListComponent} from '../../components/activity-list/activity-list.component';
import {ActivityNewComponent} from '../../components/activity-new/activity-new.component';
import {ActivityDetailComponent} from '../../components/activity-detail/activity-detail.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([{path: '', component: Tab1Page}]),
        TranslateModule
    ],
    declarations: [
        Tab1Page,
        ActivityListComponent,
        ActivityNewComponent,
        ActivityDetailComponent,
    ],
    entryComponents: [
        ActivityNewComponent,
        ActivityDetailComponent
    ]
})
export class Tab1PageModule {
}


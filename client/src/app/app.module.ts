import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PathLocationStrategy, LocationStrategy } from '@angular/common';

import { ModalModule } from 'ng2-bootstrap'
import { BsDropdownModule } from 'ng2-bootstrap/dropdown';
import { AlertModule } from 'ng2-bootstrap/alert';

import { AgmCoreModule } from 'angular2-google-maps/core';

import { MomentModule } from 'angular2-moment';

import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { AppRoutingModule } from './app-routing.module';

import { WorkordersService } from './utils/workorders.service';
import { CustomersService } from './utils/customers.service';
import { RetrieverankService } from './utils/retrieverank.service'
import { AnswerunitsService } from './utils/answerunits.service'
import { AlertService } from './utils/alert.service'
import { IotService } from './utils/iot.service'

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { SidenavComponent } from './sidenav.component';
import { TabContainerComponent } from './tab-container.component';
import { WoTabComponent } from './tabs/wo-tab.component';
import { SearchTabComponent } from './tabs/search-tab.component';
import { ChatTabComponent } from './tabs/chat-tab.component';
import { OpenWoTableComponent } from './wo-table/open-wo-table.component';
import { ClosedWoTableComponent } from './wo-table/closed-wo-table.component';
import { OpenWoMapComponent } from './wo-table/open-wo-map.component';
import { WoInfoComponent } from './wo-table/wo-info.component';

import { WoRepairComponent } from './wo-detail/wo-repair.component';
import { WoSolutionComponent } from './wo-detail/wo-solution.component';
import { WoDetailComponent } from './wo-detail/wo-detail.component';
import { WoServiceHistoryComponent } from './wo-detail/wo-service-history.component';
import { WoTroubleshootingComponent } from './wo-detail/wo-troubleshooting.component';
import { WoSolutionDetailsComponent } from './wo-detail/wo-solution-details.component';
import { WoRepairContainerComponent } from './tabs/wo-repair-container.component';
import { WoTableContainerComponent } from './tabs/wo-table-container.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { WoSummaryComponent } from './wo-detail/wo-summary.component';
import { WoSolutionContainerComponent } from './tabs/wo-solution-container.component';
import { CustomerNameCellPipe } from './utils/customer-name-cell.pipe';
import { AdminContainerComponent } from './admin/admin-container.component';
import { WoAdminComponent } from './admin/wo-admin.component';
import { AdminTabComponent } from './tabs/admin-tab.component';
import { CustomerAdminComponent } from './admin/customer-admin.component';
import { AnswerunitAdminComponent } from './admin/answerunit-admin.component';
import { SimilarityAdminComponent } from './admin/similarity-admin.component';
import { WoAdminTableComponent } from './admin/wo-admin-table.component';
import { DocAdminComponent } from './admin/doc-admin.component';
import { AuAdminTableComponent } from './admin/au-admin-table.component';
import { OneListComponent } from './utils/one-list.component';
import { IotContainerComponent } from './iot/iot-container.component';
import { IotEmitterComponent } from './iot/iot-emitter.component';
import { IotTabComponent } from './tabs/iot-tab.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SidenavComponent,
    TabContainerComponent,
    WoTabComponent,
    SearchTabComponent,
    ChatTabComponent,
    OpenWoTableComponent,
    ClosedWoTableComponent,
    OpenWoMapComponent,
    WoInfoComponent,
    WoRepairComponent,
    WoSolutionComponent,
    WoDetailComponent,
    WoServiceHistoryComponent,
    WoTroubleshootingComponent,
    WoSolutionDetailsComponent,
    WoRepairContainerComponent,
    WoTableContainerComponent,
    CustomerDetailComponent,
    WoSummaryComponent,
    WoSolutionContainerComponent,
    CustomerNameCellPipe,
    AdminContainerComponent,
    WoAdminComponent,
    AdminTabComponent,
    CustomerAdminComponent,
    AnswerunitAdminComponent,
    SimilarityAdminComponent,
    WoAdminTableComponent,
    DocAdminComponent,
    AuAdminTableComponent,
    OneListComponent,
    IotContainerComponent,
    IotEmitterComponent,
    IotTabComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AuthModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    AlertModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCh93sRL_6I3O4wtFCBZ3lr8xRasb36q3Y'
    }),
    MomentModule
  ],
  providers: [{provide: LocationStrategy, useClass: PathLocationStrategy},
    AuthGuard,
    WorkordersService,
    CustomersService,
    RetrieverankService,
    AnswerunitsService,
    AlertService,
    IotService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

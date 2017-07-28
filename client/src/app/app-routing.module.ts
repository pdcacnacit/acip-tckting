/*
# Copyright 2016 IBM Corp. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
# limitations under the License.
*/
import { NgModule }             from '@angular/core';
import { RouterModule, Routes, RouterOutlet } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { LoopbackLoginComponent } from './auth/loopback/lb-login.component';
import { LoopbackLogoutComponent } from './auth/loopback/lb-logout.component';

import { HomeComponent } from './home.component';

import { WoTabComponent } from './tabs/wo-tab.component';
import { SearchTabComponent } from './tabs/search-tab.component';
import { ChatTabComponent } from './tabs/chat-tab.component';
import { OpenWoTableComponent } from './wo-table/open-wo-table.component';
import { ClosedWoTableComponent } from './wo-table/closed-wo-table.component';
import { OpenWoMapComponent } from './wo-table/open-wo-map.component';
import { WoRepairContainerComponent } from './tabs/wo-repair-container.component';
import { WoTableContainerComponent } from './tabs/wo-table-container.component';
import { WoDetailComponent } from './wo-detail/wo-detail.component';
import { WoServiceHistoryComponent } from './wo-detail/wo-service-history.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { WoSummaryComponent } from './wo-detail/wo-summary.component';
import { WoSolutionContainerComponent } from './tabs/wo-solution-container.component';
import { WoSolutionDetailsComponent } from './wo-detail/wo-solution-details.component';
import { WoTroubleshootingComponent } from './wo-detail/wo-troubleshooting.component';

import { AdminContainerComponent } from './admin/admin-container.component';
import { WoAdminTableComponent } from './admin/wo-admin-table.component';
import { WoAdminComponent } from './admin/wo-admin.component';
import { SimilarityAdminComponent } from './admin/similarity-admin.component';
import { CustomerAdminComponent } from './admin/customer-admin.component';
import { AnswerunitAdminComponent } from './admin/answerunit-admin.component';
import { DocAdminComponent } from './admin/doc-admin.component';
import { AuAdminTableComponent } from './admin/au-admin-table.component';

import { IotTabComponent } from './tabs/iot-tab.component';
import { IotEmitterComponent } from './iot/iot-emitter.component';

const APP_ROUTES: Routes = [
  { path: 'login', component: LoopbackLoginComponent },
  { path: 'logout', component: LoopbackLogoutComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] ,
    children: [
      { path: '', redirectTo: 'wo-tab', pathMatch: 'full' },
      { path: 'wo-tab', component: WoTabComponent, children: [
        { path: 'wo-table-container', component: WoTableContainerComponent, children: [
          { path: 'open-wo-table', component: OpenWoTableComponent},
          { path: 'closed-wo-table', component: ClosedWoTableComponent },
          { path: 'open-wo-map', component: OpenWoMapComponent },
          { path: '', redirectTo: 'open-wo-table', pathMatch: 'full' }
        ] },
        { path: 'wo-repair-container', component: WoRepairContainerComponent, children: [
          { path: 'wo-detail', component: WoDetailComponent },
          { path: 'wo-service-history', component: WoServiceHistoryComponent },
          { path: 'customer-detail', component: CustomerDetailComponent },
          { path: 'wo-summary/:id', component: WoSummaryComponent },
          { path: 'wo-troubleshooting', component: WoTroubleshootingComponent },
          { path: '', redirectTo: 'wo-detail', pathMatch: 'full' }
        ] },
        { path: 'wo-solution-container', component: WoSolutionContainerComponent, children: [
          { path: 'wo-solution-details', component: WoSolutionDetailsComponent },
          { path: 'wo-summary', component: WoSummaryComponent },
          { path: '', redirectTo: 'wo-solution-details', pathMatch: 'full' }
        ] },
        { path: '', redirectTo: 'wo-table-container', pathMatch: 'full' },
      ] },
      { path: 'search-tab', component: SearchTabComponent },
      { path: 'chat-tab', component: ChatTabComponent },
      { path: 'admin-tab', component: AdminContainerComponent, children: [
        { path: 'wo-admin-table', component: WoAdminTableComponent },
        { path: 'au-admin-table', component: AuAdminTableComponent },
        { path: 'wo-admin/:id', component: WoAdminComponent },
        { path: 'similarity-admin/:id', component: SimilarityAdminComponent },
        { path: 'customer-admin/:customerName', component: CustomerAdminComponent },
        { path: 'answerunit-admin/:id', component: AnswerunitAdminComponent },
        { path: 'doc-admin', component: DocAdminComponent },
        { path: '', redirectTo: 'wo-admin-table', pathMatch: 'full' }
      ] },
      { path: 'iot-tab', component: IotTabComponent, children: [
        { path: 'iot-emitter', component: IotEmitterComponent },
        { path: '', redirectTo: 'iot-emitter', pathMatch: 'full' }
      ] }
    ]},
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(APP_ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}

import { Component, OnInit } from '@angular/core';

import { OpenWoTableComponent } from '../wo-table/open-wo-table.component';
import { ClosedWoTableComponent } from '../wo-table/closed-wo-table.component';
import { OpenWoMapComponent } from '../wo-table/open-wo-map.component';

@Component({
  selector: 'app-wo-table-container',
  template: `
    <div id="workOrderListContainer">
      <h1 class="page-header">My Work Orders</h1>

      <!-- Alert container -->
      <div id="alertContainer">
          <!-- Alert goes here -->
      </div>

      <!-- Tabs for open/closed work orders -->
      <ul class="nav nav-tabs" id="workOrderTabs">
        <li [routerLinkActive]="['active']">
          <a id="openWorkOrdersTabLink" routerLink="open-wo-table">Open</a>
        </li>
        <li [routerLinkActive]="['active']">
          <a id="closedWorkOrdersTabLink" routerLink="closed-wo-table">Closed</a>
        </li>
        <li [routerLinkActive]="['active']">
          <a id="openWorkOrdersMapTabLink" routerLink="open-wo-map">Open (Map)</a>
        </li>
      </ul>

      <!-- Tab content for open/closed work orders-->
      <div class="tab-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class WoTableContainerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

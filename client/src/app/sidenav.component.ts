import { Component, OnInit } from '@angular/core';

import { LoopbackLoginService } from './auth/loopback/lb-login.service';

import { WoTabComponent } from './tabs/wo-tab.component';
import { SearchTabComponent } from './tabs/search-tab.component';
import { ChatTabComponent } from './tabs/chat-tab.component';

@Component({
  selector: 'app-sidenav',
  template: `
    <div id="navSidebar">
        <div class="row">
            <div class="col-sm-1 col-md-1 sidebar main-sidebar">
                <ul class="nav nav-sidebar">
                    <li id="watsonIcon">
                      <img src="assets/icons/watson_avatar_white.svg" class="svg center-block" alt="Watson">
                    </li>
                    <li [routerLinkActive]="['active']">
                        <a routerLink="wo-tab">
                            <img src="assets/icons/workorders.svg" class="svg center-block" alt="Work Orders">
                        </a>
                    </li>
                    <li [routerLinkActive]="['active']">
                        <a routerLink="search-tab">
                            <img src="assets/icons/search.svg" class="svg center-block" alt="Search">
                        </a>
                    </li>
                    <li [routerLinkActive]="['active']">
                        <a routerLink="chat-tab">
                            <img src="assets/icons/contact.svg" class="svg center-block" alt="Social">
                        </a>
                    </li>
                    <li [routerLinkActive]="['active']" *ngIf="isDevice">
                        <a routerLink="iot-tab">
                            <img src="assets/icons/iot.svg" width="26" class="svg center-block" alt="IoT">
                        </a>
                    </li>
                    <li [routerLinkActive]="['active']" *ngIf="isAdmin">
                        <a routerLink="admin-tab">
                            <img src="assets/icons/people.svg" style="width:23px;height:23px" class="svg center-block" alt="Admin">
                        </a>
                    </li>
                </ul>
                <div style="position:absolute; bottom:10px; width:90%; left:1px;">
                  <a routerLink="/logout">
                    <img src="assets/icons/logout.svg" width="26" class="svg center-block" alt="Logout">
                  </a>
                </div>
            </div>
        </div>
    </div>
  `
})
export class SidenavComponent implements OnInit {

  isAdmin: boolean = false;
  isDevice: boolean = false;

  constructor(private authService:LoopbackLoginService) { }

  ngOnInit() {
    var id = this.authService.get().id;
    console.log(id)
    if (id === '2') {
      this.isDevice = true;
    }
    if (id === '3') {
      this.isAdmin = true;
    }
  }

}

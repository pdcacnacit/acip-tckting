import { Component, OnInit } from '@angular/core';

import { WoTabComponent } from './tabs/wo-tab.component';
import { SearchTabComponent } from './tabs/search-tab.component';
import { ChatTabComponent } from './tabs/chat-tab.component';

@Component({
  selector: 'app-tab-container',
  template: `
  <div class="tab-content">
    <router-outlet></router-outlet>
  </div>
  `
})
export class TabContainerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

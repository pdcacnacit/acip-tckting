import { Component, OnInit } from '@angular/core';

import { WoTableContainerComponent } from './wo-table-container.component';
import { WoRepairContainerComponent } from './wo-repair-container.component';

@Component({
  selector: 'app-wo-tab',
  template: `
  <div id="workOrderTab">
    <div class="row">
        <div id="workOrderColumn" class="col-sm-11 col-sm-offset-1 col-md-11 col-md-offset-1 main">
          <router-outlet></router-outlet>
        </div>
    </div>
</div>
  `
})
export class WoTabComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

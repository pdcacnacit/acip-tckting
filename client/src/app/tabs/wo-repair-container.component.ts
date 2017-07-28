import { Component, OnInit } from '@angular/core';

import { WoRepairComponent } from '../wo-detail/wo-repair.component';

@Component({
  selector: 'app-wo-repair-container',
  template: `
    <div id="singleWorkOrderContainer">
      <div id="infoColumn" class="col-sm-3 col-sm-offset-1 col-md-3 col-md-offset-1 sidebar">
        <app-wo-repair></app-wo-repair>
      </div>
      <div id="workOrderMainColumn" class="col-sm-8 col-sm-offset-4 col-md-8 col-md-offset-4 sidebar">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class WoRepairContainerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

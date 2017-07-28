import { Component, OnInit } from '@angular/core';

import { WoSolutionComponent } from '../wo-detail/wo-solution.component';

@Component({
  selector: 'app-wo-solution-container',
  template: `
    <div id="singleWorkOrderContainer">
      <div id="infoColumn" class="col-sm-3 col-sm-offset-1 col-md-3 col-md-offset-1 sidebar">
        <app-wo-solution></app-wo-solution>
      </div>
      <div id="workOrderMainColumn" class="col-sm-8 col-sm-offset-4 col-md-8 col-md-offset-4 sidebar">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class WoSolutionContainerComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}

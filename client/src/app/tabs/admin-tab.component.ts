import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-tab',
  template: `
  <div id="searchTab">
    <div class="row">
        <div id="socialColumn" class="col-sm-11 col-sm-offset-1 col-md-11 col-md-offset-1">
            <app-admin-container></app-admin-container>
        </div>
    </div>
  </div>
  `
})
export class AdminTabComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

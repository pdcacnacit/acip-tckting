import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-iot-tab',
  template: `
  <div id="searchTab">
    <div class="row">
        <div id="socialColumn" class="col-sm-11 col-sm-offset-1 col-md-11 col-md-offset-1">
            <app-iot-container></app-iot-container>
        </div>
    </div>
  </div>
  `
})
export class IotTabComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

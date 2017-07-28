import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-iot-container',
  template: `
    <div class="col-sm-11 col-sm-offset-1 col-md-11 col-md-offset-1 sidebar">
      <router-outlet></router-outlet>
    </div>
  `
})
export class IotContainerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

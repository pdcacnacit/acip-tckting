import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-container',
  template: `
    <div class="col-sm-11 col-sm-offset-1 col-md-11 col-md-offset-1 sidebar">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AdminContainerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

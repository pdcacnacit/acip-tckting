import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  template: `
  <div class="container-fluid">
      <router-outlet></router-outlet>
  </div>
  `
})
export class AppComponent {
  title = 'Watson Field Service Advisor';

  public constructor(private titleService: Title) {
    this.titleService.setTitle( this.title );
  }

}

import { Component, OnInit } from '@angular/core';

import { LoopbackLoginService } from './lb-login.service';

@Component({
  selector: 'app-lb-logout',
  template: `
    <h4>Logging out...</h4>
  `
})
export class LoopbackLogoutComponent implements OnInit {

  constructor(private loginService: LoopbackLoginService) { }

  ngOnInit() {
    console.log('in loopback-logout');
    this.loginService.logout().subscribe(
      success => console.log(success),
      failure => console.log(failure)
    );
  }

}

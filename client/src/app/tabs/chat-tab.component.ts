import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-tab',
  template: `
  <div id="socialTab">
    <div class="row">
        <div id="socialColumn" class="col-sm-11 col-sm-offset-1 col-md-11 col-md-offset-1">
            <iframe id="chatFrame" src="https://wfsachat.mybluemix.net/channel/field-service-advisor" frameborder="0"></iframe>
        </div>
    </div>
  </div>
  `
})
export class ChatTabComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

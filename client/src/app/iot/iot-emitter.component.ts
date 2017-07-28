import { Component, OnInit } from '@angular/core';

import { IotService } from '../utils/iot.service';

@Component({
  selector: 'app-iot-emitter',
  template: `
    <div>
      <h2>IoT Event Emitter</h2>
      <alert *ngIf="showStatus" [type]="status.type" dismissible="true"><span [innerHtml]="status.msg"></span></alert>
      <h3>Overview</h3>
      <hr>
      <p>This feature will allow you to simulate publishing device events to the Watson IoT Platform.
      These events are actual IoT event data that are sent to the Watson IoT Platform using MQTT.  An event listener is subscribed to receive events and collect the data.
      The message type of emitted events is be used to make a prediction, using Watson Machine Learning, whether a new Work Order is be created for the device.</p>
      <div style="position: relative;left: 25px;top: 30px; height:200px">
        <img src="assets/icons/elevator.svg" alt="device" width="150" style="position: absolute;left: 100px">
        <img src="assets/icons/next.svg" alt="arrow" width="100" style="position: absolute;left: 270px; top:30px">
        <img [src]="workingImg" alt="device" width="150" style="position: absolute;left: 390px">
        <img src="assets/icons/next.svg" alt="arrow" width="100" style="position: absolute;left: 560px; top:30px">
        <img src="assets/icons/analytics-chart-symbol.svg" alt="analytics" width="150" style="position: absolute;left: 680px">
      </div>
      <h3>Start the Event Emitter</h3>
      <hr>
      <p>The event emitter will simulate sending 2000 events from a different devices in a few minutes.  Only ONE emitter can run at a time for obvious reasons.
      Once the emitter is completed, a new Work Order would have created.  The newly created Work Order will live for 60 minutes and can be accessed from the Work Order tab.</p>
      <br>
      <button type="button" [ngClass]="{'disabled': isRunning()}" class="btn btn-success" (click)='isRunning() || startEventEmitter()'>Start...</button>
      <br>
      <div style="position:fixed; bottom:0px; right:0px; font-size:8px">Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
    </div>
  `
})
export class IotEmitterComponent implements OnInit {

  workingImg: string = 'assets/icons/cloud-computing.svg';
  showStatus: boolean = false;
  status: any = { state: 'stopped' };
  pollingSubscription;

  constructor(private iotService: IotService) { }

  ngOnInit() {
    this.pollEventEmitter(1000);
  }

  startEventEmitter() {
    this.showStatus = true;
    this.status.msg = 'Starting the event emitter...';
    this.iotService.startEventEmitter().subscribe(status => {
      this.status.msg = 'Event Emitter started...';
      this.pollEventEmitter(5000);
    }, failure => {
      console.log(failure)
    });
  }

  isRunning() {
    return !this.status.state || this.status.state === 'running';
  }

  pollEventEmitter(interval) {
    this.pollingSubscription = this.iotService.pollEventEmitterStatus(interval).subscribe(status => {
      this.showStatus = true;
      this.status = status;
      if (status.state === 'stopped' || !status.state) {
        this.workingImg = 'assets/icons/cloud-computing.svg';
        this.pollingSubscription.unsubscribe();
      } else {
        this.workingImg = 'assets/icons/WATSON_BLACK_150px.gif';
      }
      this.status = status;
    })
  }
}

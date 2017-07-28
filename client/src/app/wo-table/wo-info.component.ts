import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { WorkordersService } from '../utils/workorders.service';

@Component({
  selector: 'app-wo-info',
  template: `
  <div id="openWorkOrderDetail">
    <div id="openWorkOrderDetailContent" style="overflow: scroll;">
      <button *ngIf="!workOrder.isClosed" type="button" class="btn btn-success btn-lg" routerLink="../../wo-repair-container">Start Repair</button>
      <h3>Work Order {{workOrder.workOrderId}}</h3><br>
      <h4>Issue</h4>
      <p>{{workOrder.issueText}}</p>
      <div *ngIf="workOrder.partsList && workOrder.partsList.length > 0">
        <h4>Parts</h4>
        <ul>
          <li *ngFor="let part of workOrder.partsList">{{part}}</li>
        </ul>
      </div>
      <div *ngIf="workOrder.toolsList && workOrder.toolsList.length > 0">
        <h4>Tools</h4>
        <ul>
          <li *ngFor="let tool of workOrder.toolsList">{{tool}}</li>
        </ul>
      </div>
      <div *ngIf="workOrder.bonusFix">
        <h4>Next Best Action</h4>
        <ul>
          <li>{{workOrder.bonusFix}}</li>
        </ul>
      </div>
    </div>
  </div>
  `
})
export class WoInfoComponent implements OnInit {

  private workOrder: any = {};

  private activeWorkOrderSubscription:Subscription;

  constructor(private workordersService:WorkordersService) {}

  ngOnInit() {
    this.activeWorkOrderSubscription = this.workordersService.getActiveWorkOrder()
       .subscribe(workOrder => {
         console.log('Wo-Info Workorder Selected: ' + workOrder.id)
         this.workOrder = workOrder;
       })
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.activeWorkOrderSubscription.unsubscribe();
  }
}

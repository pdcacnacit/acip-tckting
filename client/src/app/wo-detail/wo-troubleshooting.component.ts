import { Component, OnInit } from '@angular/core';

import { WorkordersService } from '../utils/workorders.service';
import { CustomersService } from '../utils/customers.service';

@Component({
  selector: 'app-wo-troubleshooting',
  template: `
    <div id="troubleshootingContent">
        <button id="backFromTroubleshootingButton" type="button" class="btn btn-link btn-lg" routerLink="../../wo-solution-container/wo-solution-details">
            <i class="fa fa-chevron-left"></i>
        </button>
        <h2 id="troubleshootingTitle">Similar Cases</h2>
        <br>
        <div id="troubleshootingList">
          <div class="service-history-item" *ngFor="let workOrder of troubleShootingWoList">
            <div class="service-history-item service-history-item-first">
              <div class="service-history-item-score"><p>{{similarityList[workOrder.workOrderId].similarityPercentage}}  MATCH</p></div>
              <div class="service-history-item-text">
                <b>Issue: </b>{{workOrder.issueSnippet}}<br>
                <b>Solution: </b>{{workOrder.solutionTitle}}<br>
                <button type="button" class="btn btn-link btn-lg" routerLink="../../wo-repair-container/wo-summary/{{workOrder.workOrderId}}" [queryParams]="{from: '../../../wo-repair-container/wo-troubleshooting'}">View Summary</button>
            </div>
          </div>
        </div>
    </div>
  `
})
export class WoTroubleshootingComponent implements OnInit {

  activeWorkOrder: any = {};
  customer: any = {};
  troubleShootingWoList: any[];
  similarityList: any[];

  constructor(private workordersService:WorkordersService, private customersService: CustomersService) {
    this.activeWorkOrder = workordersService.activeWorkOrder;
    this.customer = customersService.activeCustomer;
    workordersService.getTroubleShootingWoList(this.activeWorkOrder.id).subscribe(
      similarities => {
        this.troubleShootingWoList = similarities.attachedWorkOrders;
        this.similarityList = similarities.similarities;
        for (var wo of this.troubleShootingWoList) {
          wo.similarityPercentage = this.similarityList[wo.workOrderId];
        }
      },
      error => console.log(error)
    );
  }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';

import { WorkordersService } from '../utils/workorders.service';
import { CustomersService } from '../utils/customers.service';

@Component({
  selector: 'app-wo-service-history',
  template: `
    <div id="serviceHistoryContent">
        <button id="backToWorkOrderDetailButton" type="button" class="btn btn-link btn-lg" routerLink="../wo-detail">
            <i class="fa fa-chevron-left"></i>
        </button>
        <h2 id="serviceHistoryTitle">Service History</h2>
        <br>
        <div id="serviceHistoryList">
            <div class="service-history-item" *ngFor="let workOrder of serviceHistory; let i = index">
              <div class="service-history-item-date">
                <p>{{workOrder.dateString}}</p>
              </div>
              <div class="service-history-item-text">
                <p><b>Issue: </b>{{workOrder.issueSnippet}}</p>
                <p><b>Solution: </b>{{workOrder.solutionTitle}}</p>
                <button type="button" class="btn btn-link btn-lg" [routerLink]="['../wo-summary', workOrder.workOrderId]" [queryParams]="{from: '../../wo-service-history'}">View Summary</button>
              </div>
            </div>
        </div>
    </div>
  `
})
export class WoServiceHistoryComponent implements OnInit {

  workOrder = {};
  customer:any = {};
  serviceHistory:any[] = [];

  constructor(private workordersService:WorkordersService, private customersService: CustomersService) {
  }

  ngOnInit() {
    this.workOrder = this.workordersService.activeWorkOrder;
    this.customer = this.customersService.activeCustomer;
    this.workordersService.getServiceHistory(this.customer.serviceHistory).subscribe(
      history => {
        this.serviceHistory = history;
      },
      error => console.log(error)
    );
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { WorkordersService } from '../utils/workorders.service';
import { CustomerNameCellPipe } from '../utils/customer-name-cell.pipe';

declare var $:any;

@Component({
  selector: 'app-open-wo-table',
  template: `
   <div id="openWorkOrdersTab">
    <div id="openWorkOrdersTable">
      <div class="table-responsive">
        <table class="table">
          <thead><tr><th>#</th><th>Time</th><th>Customer</th><th>Equipment</th><th>Issue</th></tr></thead>
          <tbody>
            <tr *ngFor="let workOrder of openWorkOrders">
               <td>{{workOrder.workOrderId}}</td>
               <td>{{workOrder.timeString}}</td>
               <td [innerHTML]="workOrder | customerNameCell"></td>
               <td>{{workOrder.equipmentName}}</td>
               <td>{{workOrder.issueSnippet}}
                 <button type="button" (click)="selectWorkOrder(workOrder)" class="btn btn-link slide-trigger-open">
                   <i class="fa fa-chevron-right"></i>
                 </button>
               </td>
            </tr>
          </tbody>
        </table>
      </div>
      <app-wo-info></app-wo-info>
    </div>
  </div>
  `
})
export class OpenWoTableComponent implements OnInit {

  openWorkOrders:any;
  dataAvailable = false;

  constructor(private workordersService:WorkordersService) { }

  ngOnInit() {
    this.workordersService.getOpenWorkOrders()
    .finally(() => {
      this.setWorkOrderSliders();
    })
    .subscribe(
      workOrders => {
        let that = this;
        this.openWorkOrders = workOrders;
        this.openWorkOrders.sort(function(a, b) {
          let dtA = that.getDateFromTime(a.timeString);
          let dtB = that.getDateFromTime(b.timeString);
          if (dtA < dtB) {
            return -1;
          }
          if (dtA > dtB) {
            return 1;
          }
          // a must be equal to b
          return 0;
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  getDateFromTime(timeString:string):any {
    var dt = new Date();
    var t = timeString.match(/(\d+)(?::(\d\d))?\s*([AP]M)/);
    if (t[3] === 'PM') {
      dt.setHours  ( parseInt(t[1] + 12) + (t[3] ? 12 : 0) );
    } else {
      dt.setHours  ( parseInt(t[1]) + (t[3] ? 12 : 0) );
    }
    dt.setMinutes( parseInt(t[2]) || 0 );
    return dt;
  }

  setWorkOrderSliders() {
    setTimeout(function() {
      let that = this;
      let width = $(window).width() - $("#openWorkOrdersTable th:last-child").offset().left;
      let offset = $("#openWorkOrdersTable").offset().top;
      $("#openWorkOrderDetail").slideReveal({
          trigger: $(".slide-trigger-open"),
          position: "right",
          push: false,
          overlay: true,
          overlayColor: "rgba(0,0,0,0)",
          width: width,
          top: offset,
          show: function() {
            console.log('Showing the slider');
          }
      });
    }, 1000);

  }

  selectWorkOrder(workOrder) {
    this.workordersService.setActiveWorkOrder(workOrder);
  }
}

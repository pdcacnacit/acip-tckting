import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter  } from '@angular/core';

import { WorkordersService } from '../utils/workorders.service';
import { CustomerNameCellPipe } from '../utils/customer-name-cell.pipe';

declare var $:any;

@Component({
  selector: 'app-closed-wo-table',
  template: `
  <div id="closedWorkOrdersTab">
    <div id="closedWorkOrdersTable">
        <div class="table-responsive">
          <table class="table">
            <thead><tr><th>#</th><th>Time</th><th>Customer</th><th>Equipment</th><th>Issue</th></tr></thead>
            <tbody>
              <tr *ngFor="let workOrder of closedWorkOrders">
                 <td>{{workOrder.workOrderId}}</td>
                 <td>{{workOrder.dateString}}<br>{{workOrder.timeString}}</td>
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
export class ClosedWoTableComponent implements OnInit {

  closedWorkOrders:any;
  dataAvailable = false;

  @Output() selectedChange: EventEmitter<any> = new EventEmitter();

  constructor(private workordersService:WorkordersService) { }

  getCustomerCellContent(workOrder) { }

  ngOnInit() {
    this.workordersService.getClosedWorkOrders()
    .finally(() => {
      this.setWorkOrderSliders();
    })
    .subscribe(
      workOrders => {
        this.closedWorkOrders = workOrders;
      },
      err => {
        console.log(err);
      }
    );
  }

  setWorkOrderSliders() {
    let that = this;
    setTimeout(function() {
      let width = $(window).width() - $("#closedWorkOrdersTable th:last-child").offset().left;
      let offset = $("#closedWorkOrdersTable").offset().top;
      $("#openWorkOrderDetail").slideReveal({
          trigger: $(".slide-trigger-open"),
          position: "right",
          push: false,
          overlay: true,
          overlayColor: "rgba(0,0,0,0)",
          width: width,
          top: offset,
          show: function() {
          }
      });
    }, 500);
  }

  selectWorkOrder(workOrder) {
    this.workordersService.setActiveWorkOrder(workOrder);
  }
}

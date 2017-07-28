import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';

import { WorkordersService } from '../utils/workorders.service';
import { CustomersService } from '../utils/customers.service';

declare var $:any;

@Component({
  selector: 'app-wo-repair',
  template: `
      <div id="workOrderInfo" #workOrderInfo>
        <button id="backToWorkOrdersButton" type="button" class="btn btn-link btn-lg" routerLink="../wo-table-container">
            <i class="fa fa-chevron-left"></i>
        </button>
        <h4 id="infoWorkOrderId">
            WORK ORDER {{workOrder.workOrderId}}
        </h4>
        <h2 id="infoEquipmentName">
            {{workOrder.equipmentName}}
        </h2>
        <div id="infoEquipmentSerial">
            <b>Serial: </b> {{workOrder.equipmentSerial}}
        </div>
        <br>
        <div id="infoCustomerName" class="customer-info">
            <img src="assets/icons/customer.svg" class="svg left-block" alt="Customer Icon">
            <button id="customerDetailButton" type="button" class="btn btn-link btn-lg" routerLink="customer-detail">
                {{customer.customerName}}
            </button>
            <br>
            <small id="customerLevel">
                {{customer.customerLevel}}  Customer
            </small>
        </div>
        <div id="infoCustomerAddress" class="customer-info">
            <img src="assets/icons/location.svg" class="svg left-block" alt="Location Icon">
            <a id="customerLocationLink" role="button" class="btn btn-link btn-lg btn-map-link" [innerHTML]="customerAddress">
            </a>
        </div>
        <div id="infoCustomerWarranty" class="customer-info">
            <img src="assets/icons/check.svg" class="svg left-block" alt="Warranty Icon">
            <div id="infoCustomerWarrantyText">
                <p>Under warranty until {{customer.warrantyExpiration}}</p>
            </div>
        </div>
        <div id="infoCustomerPurchase" class="customer-info">
            <img src="assets/icons/calendar.svg" class="svg left-block" alt="Purchase Date Icon">
            <div id="infoCustomerPurchaseText">
                <p>Installed in {{customer.purchaseDateString}}</p>
            </div>
        </div>
        <div id="infoCustomerServiceHistory" class="customer-info">
            <img src="assets/icons/service_history.svg" class="svg left-block" alt="History Icon">
            <button id="serviceHistoryButton" type="button" class="btn btn-link btn-lg" routerLink="wo-service-history">
                Service History
            </button>
        </div>

    </div>
  `
})
export class WoRepairComponent implements OnInit, AfterViewInit {

  private workOrder: any = {};
  private customer: any = {};
  private customerAddress: string;

  constructor(private workordersService:WorkordersService, private customersService: CustomersService) {
    this.workOrder = workordersService.activeWorkOrder;
    this.customer = customersService.activeCustomer;
    this.customerAddress = customersService.getLineBrokenAddress(this.customer.customerAddress);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $('.slide-reveal-overlay').css('display', 'none');
  }

}

import { Component, OnInit } from '@angular/core';

import { CustomersService } from '../utils/customers.service';

@Component({
  selector: 'app-customer-detail',
  template: `
    <div id="customerDetailContent">
       <button id="backToWorkOrderDetailFromCustomerButton" type="button" class="btn btn-link btn-lg" routerLink="../wo-detail">
           <i class="fa fa-chevron-left"></i>
       </button>
       <h2 id="customerDetailTitle">
           {{customer.customerName}}
       </h2>
       <h4 id="primaryContactTitle">Primary Contact</h4>
       <br>
       <div id="primaryContactInfo">
           <h4 id="primaryContactName">
               Name: {{customer.primaryContact.contactName}}
           </h4>
           <a id="primaryContactPhoneButton" href="{{'tel:' + customer.primaryContact.contactPhone}}" role="button" class="btn btn-link btn-lg">
               {{customer.primaryContact.contactPhoneDisplayText}}
           </a>
           <br>
           <a id="primaryContactEmailButton" href="{{'mailto:' + customer.primaryContact.contactEmail}}" role="button" class="btn btn-link btn-lg">
               {{customer.primaryContact.contactEmail}}
           </a>
           <h4 id="primaryContactNotes">
               Notes: {{customer.primaryContact.contactNotes}}
           </h4>
       </div>
   </div>
  `
})
export class CustomerDetailComponent implements OnInit {

  customer: any = {};

  constructor(private customersService: CustomersService) {

  }

  ngOnInit() {
    this.customer = this.customersService.activeCustomer;
  }

}

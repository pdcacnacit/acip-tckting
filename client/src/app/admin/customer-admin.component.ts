import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { CustomersService } from '../utils/customers.service';

@Component({
  selector: 'app-customer-admin',
  templateUrl: './customer-admin.component.html'
})
export class CustomerAdminComponent implements OnInit {

  sub;
  serviceHistory;
  customer;

  constructor(private router: Router, private route: ActivatedRoute, private customersService: CustomersService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let customerName = params['customerName'];
      this.customersService.findCustomer(customerName).subscribe(
        success => this.customer = success,
        failure => console.log(failure)
      )
    });
  }

  saveCustomer(workOrderForm: NgForm) {
    this.customersService.saveCustomer(this.customer).subscribe(
      success => {
        this.customer = null;
        this.router.navigate(['/home/admin-tab/wo-admin-table']);
      },
      error => console.log(error)
    )
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}

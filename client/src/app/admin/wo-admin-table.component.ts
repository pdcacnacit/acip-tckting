import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { WorkordersService } from '../utils/workorders.service';
import { AlertService } from '../utils/alert.service'

@Component({
  selector: 'app-wo-admin-table',
  templateUrl: './wo-admin-table.component.html'
})
export class WoAdminTableComponent implements OnInit {

  workOrders;
  showAlert: boolean = false;
  alert;

  constructor(private workordersService: WorkordersService, private alertService: AlertService) { }

  ngOnInit() {
    let that = this;
    this.workordersService.getAllWorkOrders().subscribe(
      success => {
        this.workOrders = success;
        this.workOrders.sort(function(a, b) {
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
      failure => console.log(failure)
    )
  }

  ngAfterViewInit() {
    let a = this.alertService.getLatestAlert();
    if (a && a.msg) {
      this.alert = a;
      this.showAlert = true;
    } else {
      this.showAlert = false;
    }
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
}

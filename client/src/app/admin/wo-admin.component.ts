import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { WorkordersService } from '../utils/workorders.service';
import { AnswerunitsService } from '../utils/answerunits.service';
import { AlertService } from '../utils/alert.service'

import { OneListComponent, NameValuePair } from '../utils/one-list.component';

@Component({
  selector: 'app-wo-admin',
  templateUrl: 'wo-admin.html'
})
export class WoAdminComponent implements OnInit {

  sub;
  workOrder;
  answerIds;
  partsListNvp = [];
  toolsListNvp = [];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private workOrdersService: WorkordersService,
    private answerUnitsService: AnswerunitsService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let id = params['id'];
      this.workOrdersService.getWorkOrderById(id).subscribe(
        success => {
          this.workOrder = success;
          for (let part of this.workOrder.partsList) {
            let nvp = new NameValuePair(part, part);
            this.partsListNvp.push(nvp);
          }
          for (let tool of this.workOrder.toolsList) {
            let nvp = new NameValuePair(tool, tool);
            this.toolsListNvp.push(nvp);
          }
        },
        failure => console.log(failure)
      );
    });
    this.answerUnitsService.listAnswerIds().subscribe(
      success => this.answerIds = success,
      failure => console.log(failure)
    );
  }

  saveWorkOrder(workOrderForm: NgForm) {
    // Convert the PartListNvp to a String array
    this.workOrder.partsList = [];
    for (let nvp of this.partsListNvp) {
      if (nvp.name) {
        this.workOrder.partsList.push(nvp.value);
      }
    }
    // Convert the ToolsListNvp to a String array
    this.workOrder.toolsList = [];
    for (let nvp of this.toolsListNvp) {
      if (nvp.name) {
        this.workOrder.toolsList.push(nvp.value);
      }
    }
    this.workOrdersService.saveWorkOrder(this.workOrder).subscribe(
      success => {
        this.workOrder = null;
        this.partsListNvp = [];
        this.toolsListNvp = [];
        this.router.navigate(['/home/admin-tab/wo-admin-table']);
        this.alertService.setAlert('success', 'Work order successfully saved.')
      },
      failure => console.log(failure)
    )
  }

  onSolutionChange(e) {
    for (let answerId of this.answerIds) {
      if (answerId.id === e) {
        this.workOrder.solutionTitle = answerId.title;
      }
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

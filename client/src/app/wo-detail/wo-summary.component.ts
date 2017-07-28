import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { WorkordersService } from '../utils/workorders.service';
import { AnswerunitsService } from '../utils/answerunits.service';

@Component({
  selector: 'app-wo-summary',
  template: `
    <div id="workOrderSummaryContainer">
      <button id="backFromSummaryButton" type="button" class="btn btn-link btn-lg" routerLink="{{from}}">
          <i class="fa fa-chevron-left"></i>
      </button>
      <div *ngIf="workOrder">
        <div id="summaryHeadlineContainer" class="summary-container">
            <h2 id="summaryWorkOrderId">
                Work Order {{workOrder.workOrderId}} &mdash; Summary
            </h2>
            <h4 id="summaryDateTimeString">
                {{workOrder.dateString}} &mdash; {{workOrder.timeString}}
            </h4>
            <h4 id="summaryCustomerString">
                Customer: {{workOrder.customerName}}
            </h4>
        </div>
        <div id="summaryIssueContainer" class="summary-container">
            <h4 id="summaryIssueTitle">
                Issue
            </h4>
            <div id="summaryIssueText">
                {{workOrder.issueText}}
            </div>
            <h4 id="summaryIssueTitle">
                Failed Component
            </h4>
            <div id="summaryIssueText" *ngIf="prediction">
                Based on analysis of previous work orders, it was predicted that component <span style="color:green">{{prediction.data[0][1]}}</span> would be replaced.
            </div>
            <div *ngIf="answerUnit">
              <h4 id="summarySolutionTitle">
                  Recommended Solution - {{answerUnit.title}}
              </h4>
              <div id="summarySolutionSnippet">
                  {{answerUnit.bodySnippet}}
              </div>
            </div>
        </div>
        <div id="summaryNotesContainer" class="summary-container">
            <h4>
                Field Notes
            </h4>
            <div id="summaryNotesText" *ngIf="workOrder.technicianNotes">
                {{workOrder.technicianNotes}}
            </div>
            <div id="inputNotesText" *ngIf="!workOrder.isClosed">
                <textarea rows="5" style="width:90%; margin-left:40px;"></textarea>
            </div>
        </div>
        <div id="summarySignAndCloseContainer" class="summary-container" *ngIf="workOrder.workOrderId === '10000001'">
            <button id="closeButton" type="button" class="btn btn-success btn-lg" (click)="completeWorkOrder()">
                <img id="closeCheckIcon" src="assets/icons/check.svg" class="svg left-block">
                <div id="closeCheckText">
                    Complete
                </div>
            </button>
        </div>
      </div>
  </div>
`
})
export class WoSummaryComponent implements OnInit, OnDestroy {

  private from:string = '../../wo-service-history';
  private sub: any;
  private workOrder:any;
  private answerUnit:any;
  private prediction:any;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private workordersService:WorkordersService,
    private answerUnitsService: AnswerunitsService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.from = params['from'];
    });
    this.sub = this.route.params.subscribe(params => {
      let id = params['id'];
       this.workordersService.getWorkOrderById(id).subscribe(
         workOrder => {
           this.workOrder = workOrder;
           this.prediction = workOrder.prediction[0];
           if (workOrder.solutionAnswerId) {
             this.answerUnitsService.getAnswerUnit(this.workOrder.solutionAnswerId).subscribe(
               answerUnit => this.answerUnit = answerUnit,
               failed => console.log(failed)
             )
           } else {
             let topAnswerId = this.answerUnitsService.topAnswerId;
             if (topAnswerId) {
               this.answerUnitsService.getAnswerUnit(topAnswerId).subscribe(
                 answerUnit => this.answerUnit = answerUnit,
                 failed => console.log(failed)
               )
             }
           }
         },
         error => console.log(error)
       );
    });
  }

  completeWorkOrder() {
    console.log('Completing the work order')
    this.workordersService.completeWorkOrder(this.workOrder.workOrderId).subscribe(success => {
      console.log(success)
      this.router.navigate(['/home']);
    },
    failed => console.log(failed))
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

import { Component, OnInit, Input } from '@angular/core';

import { WorkordersService } from '../utils/workorders.service';
import { RetrieverankService } from '../utils/retrieverank.service';

@Component({
  selector: 'app-wo-solution',
  template: `
    <div id="solutionInfo">
      <button id="backToSingleWorkOrderButton" type="button" class="btn btn-link btn-lg" routerLink="../wo-repair-container">
          <i class="fa fa-chevron-left"></i>
      </button>
      <h4 id="solutionInfoWorkOrderId">
          WORK ORDER {{workOrder.workOrderId}}
      </h4>
      <h3>Best Solution</h3>
      <div id="solutionInfoScrollable">
          <div id="solutionTitle" class="solution-info-content">
              <p>{{topAnswer.topic}}</p>
          </div>
          <div id="solutionTimeContainer" class="solution-info-content">
              <img src="assets/icons/time_white.png" class="left-block">
              <div id="solutionInfoTimeText">
              <!--    {{topAnswer.estimatedTimeMinutes}} min-->
                  5 min
              </div>
          </div>
          <div id="solutionSuccessContainer" class="solution-info-content">
              <img src="assets/icons/success_white.svg" class="svg left-block">
              <div id="solutionInfoSuccessText">
                  <p>{{topAnswer.score}} % success</p>
              </div>
          </div>
          <div id="solutionSuccessContainer" class="solution-info-content">
              <img src="assets/icons/success_white.svg" class="svg left-block">
              <div id="solutionInfoSuccessText">
                  <p>87% solution probability</p>
              </div>
          </div>
          <div id="solutionPartsContainer" class="solution-info-content">
              <b>Parts</b>
              <div id="solutionInfoPartsList">
                  <p>{{workOrder.partsList}}</p>
              </div>
          </div>
          <div id="solutionToolsContainer" class="solution-info-content">
              <b>Tools</b>
              <div id="solutionInfoToolsList">
                  <p>{{workOrder.toolsList}}</p>
              </div>
          </div>
      </div>

      <div id="solutionInfoButtons">
          <button id="troubleshootButton" type="button" class="btn btn-success btn-lg" routerLink="../wo-repair-container/wo-troubleshooting">
              Troubleshoot
          </button>
          <br>
          <button id="completeButton" type="button" class="btn btn-success btn-lg" routerLink="../wo-repair-container/wo-summary/{{workOrder.workOrderId}}" [queryParams]="{from: '../../../wo-solution-container/wo-solution-details'}">
              <img id="completeCheckIcon" src="assets/icons/check.svg" class="svg left-block">
              <div id="completeCheckText">
                  Complete
              </div>
          </button>
      </div>
    </div>
  `
})
export class WoSolutionComponent implements OnInit {

  private workOrder: any = {};
  private topAnswer: any = {};
  private answerCount: number = 0;

  constructor(private workordersService:WorkordersService, private retrieveRankService: RetrieverankService) {
  }

  ngOnInit() {
    this.workOrder = this.workordersService.activeWorkOrder;
    let issueTextParts = this.workordersService.activeWorkOrder.issueText.split(':');
    let query = issueTextParts[issueTextParts.length-1].trim();
    this.retrieveRankService.query(query).subscribe(
      answers => {
        this.topAnswer = answers.rankedAnswers[0];
        this.answerCount = answers.answerCount - 1;
      },
      error => console.log(error)
    );
  }

}

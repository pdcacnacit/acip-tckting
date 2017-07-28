import { Component, OnInit } from '@angular/core';

import { WorkordersService } from '../utils/workorders.service';
import { RetrieverankService } from '../utils/retrieverank.service';

@Component({
  selector: 'app-wo-detail',
  template: `
    <div id="workOrderDetailContent">
      <img src="assets/icons/issue.svg" class="svg left-block" alt="Issue Icon">
      <h3 id="symptomsTitle">Symptoms and Issue</h3>
      <h4 id="workOrderDetailIssue">
          {{workOrder.issueText}}
      </h4>
      <br>
      <div id="solutionContainer" *ngIf="dataAvailable">
        <div class="solution-box">
          <img src="assets/icons/watson_avatar_black.svg" class="svg left-block solution-watson-icon" alt="Watson Icon">
          <div id="solutionBoxText" class="solution-text">
            <h3>Best Solution</h3>
            {{topAnswer.topic}}
            <h5>{{topAnswer.answerID }}</h5>
            <b>Parts: </b>{{workOrder.partsList}}<br>
            <b>Tools: </b>{{workOrder.toolsList}}<br>
            <small><br>{{answerCount}} additional passages found</small>
            <h5 class="solution-prediction" *ngIf="prediction">
                Based on analysis of previous work orders, it is predicted that component <span style="color:red">{{prediction.data[0][1]}}</span> would need to be replaced.
            </h5>
          </div>
          <button type="button" class="btn btn-success btn-lg" routerLink="../../wo-solution-container">Start</button>
          <div class="solution-time">
              <img src="assets/icons/time_grey.png" class="left-block" alt="Time Icon">
              <div id="solutionTimeText">
              <!--    <p>{{topAnswer.estimatedTimeMinutes}} min</p> -->
                  <p>5 min</p>
              </div>
          </div>
          <div class="solution-success">
              <img src="assets/icons/success.svg" class="svg left-block" alt="Success Icon">
              <div id="solutionSuccessText">
                  <p>{{topAnswer.score}} % success</p>
              </div>
          </div>
        </div>
      </div>
   </div>
  `
})
export class WoDetailComponent implements OnInit {

  private workOrder: any = {};
  private topAnswer: any = {};
  private answerCount: number = 0;

  private dataAvailable = false;

  private prediction;

  constructor(private workordersService:WorkordersService, private retrieveRankService: RetrieverankService) {
  }

  ngOnInit() {
    this.workOrder = this.workordersService.activeWorkOrder;
    let issueTextParts = this.workOrder.issueText.split(':');
    let query = issueTextParts[issueTextParts.length-1].trim();
    this.retrieveRankService.query(query).subscribe(
      response => {
        let solutions = response.rankedAnswers;
        this.topAnswer = response.rankedAnswers[0];
        this.answerCount = response.answerCount - 1;
        this.dataAvailable = true;
      },
      error => console.log(error)
    );
      console.log("In detail components " + this.workOrder.issueText);
    // Get the Component that is predicted to fail
    this.workordersService.getComponentCodePrediction(this.workOrder.id).subscribe(
      prediction => this.prediction = prediction[0],
      failure => console.log(failure)
    )
  }

}

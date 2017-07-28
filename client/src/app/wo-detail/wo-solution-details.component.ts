import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { ModalDirective } from 'ng2-bootstrap';

import { WorkordersService } from '../utils/workorders.service';
import { RetrieverankService } from '../utils/retrieverank.service';
import { AnswerunitsService } from '../utils/answerunits.service';

declare var $:any;

@Component({
  selector: 'app-wo-solution-details',
  template: `
  <div id="solutionDetailContent">
    <button id="openNotesButton" type="button" class="btn btn-link btn-lg" (click)="solutionNotesModal.show()">
        <img id="notesIcon" src="assets/icons/notes.svg" class="svg right-block" alt="Notes Icon">
    </button>
    <h3 id="solutionDetailTitle">Repair Passages</h3>
    <br>
    <br>
    <div id="passagesContainer">
      <div class="passage-box" *ngFor="let answer of answers; let i = index">
        <div class="passage-text">
          <h3>{{answer.topic}}</h3>
          <p>{{answer.resolution}}</p>
          <br>
          <button type="button" class="btn btn-lg btn-link" (click)="showAnswerModal(i)">View Passage</button>
        </div>
        <div class="passage-rating-container">
          <div class="passage-rating">
            <!--<input id="starRating-{{i}}" attr.data-id="{{answer.answerId}}" type="number" class="rating" min="0" max="3" data-size="sm" data-show-caption="false" data-stars="3">-->
            <!--
            <form action="" class="form">
                <select name="feedback">
                  <option value="0" selected>0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
                <input type="submit" ng-submit="submitFeedback(i)">
            </form>
            -->
            <form>
              <select class="form-control" name="feedback" [(ngModel)]="selectedFeedback[i]" required>
                <option [ngValue]="0">0</option>
                <option [ngValue]="1">1</option>
                <option [ngValue]="2">2</option>
                <option [ngValue]="3">3</option>
                <option [ngValue]="4">4</option>
              </select>
              <button (click)="submitFeedback(i)">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Solution notes modal -->
  <div class="modal fade" bsModal #solutionNotesModal="bs-modal" [config]="{backdrop: false}">
      <div class="modal-dialog modal-lg">

          <!-- Modal content-->
          <div class="modal-content">
              <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" (click)="solutionNotesModal.hide()">&times;</button>
                  <div>
                      <h2 class="modal-title">
                          Notes
                      </h2>
                      <h4 id="solutionNotesId">
                          <!-- Notes title -->
                      </h4>
                  </div>
              </div>
              <div id="solutionNotesBody" class="modal-body">
                  <!-- Modal body -->
                  <div class="form-group">
                      <textarea id="solutionNotesText" rows="16" class="form-control" placeholder="Enter text..."></textarea>
                  </div>
              </div>
          </div>

      </div>
  </div>
  <!-- Search result detail modal -->
  <div class="modal fade" bsModal #answerUnitAttachmentModal="bs-modal" [config]="{backdrop: false}">
      <div class="modal-dialog modal-lg">

          <!-- Modal content-->
          <div class="modal-content" *ngIf="selectedAnswer" style="height: 600px;">
              <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" (click)="hideAnswerModal()">&times;</button>
                  <div>
                      <h3 id="searchResultDetailTitle" class="modal-title">
                          {{selectedAnswer.title}}
                      </h3>
                  </div>
              </div>
              <div id="searchResultDetailBody" class="modal-body" style="height: 480px;">
                {{selectedAnswer.resolution}}
                <!-- object class="e2e-trusted-url" class="pdf-viewer" [data]="getDocumentUrl()" type="application/pdf"></object -->
                <!-- <div id="pdf" style="height: 100%; width: 100%">
                   <iframe [src]="getDocumentUrl()" style="height: 100%; width: 100%" frameborder="0" scrolling="no">
                        <p>It appears your web browser doesn't support iframes.</p>
                   </iframe>
                </div> -->
              </div>
              <div id="searchResultDetailFooter" class="modal-footer">
                  <button class="btn btn-success pull-right" (click)="hideAnswerModal()">Close</button>
              </div>
          </div>

      </div>
  </div>
  `
})
export class WoSolutionDetailsComponent implements OnInit {

  @ViewChild('answerUnitAttachmentModal') public answerUnitAttachmentModal:ModalDirective;

  answers;
  answerCount;
  selectedAnswer:any;
  selectedFeedback:any[] = [];

  private workOrder: any = {};

  constructor(private sanitizer: DomSanitizer, private http: Http, private workordersService:WorkordersService, private retrieveRankService: RetrieverankService, private answerUnitsService: AnswerunitsService) { }

  ngOnInit() {
    console.log('INIT');
    this.workOrder = this.workordersService.activeWorkOrder;
    console.log("In solution detail components " + this.workOrder.issueText);
    let issueTextParts = this.workordersService.activeWorkOrder.issueText.split(':');
    let query = issueTextParts[issueTextParts.length-1].trim();
    this.retrieveRankService.query(query).subscribe(
      answers => {
        this.answers = answers.rankedAnswers;
        this.answerCount = answers.answerCount;
      },
      error => console.log(error)
    );
    for (var i = 0; i < this.answerCount; i++){
      this.selectedFeedback.push("0");
    }
  }

  ngAfterViewInit() {
    var that = this;
    setTimeout(function() {
      for (var i = 0; i < that.answerCount; i++) {
        let ratingEle = '#starRating-' + i;
        console.log('per iterator' + i);
        $(ratingEle).rating({});
        $(ratingEle).on('rating.change', function(event, value, caption) {
            console.log('On Rating Change');
            that.answerUnitsService.topAnswerId = $(event.target).data('id');
        });
      }
    }, 800);
  }

  showAnswerModal(idx:number) {
    this.selectedAnswer = this.answers[idx];
    this.answerUnitAttachmentModal.show();
  }

  hideAnswerModal() {
    this.selectedAnswer = null;
    this.answerUnitAttachmentModal.hide();
  }

  submitFeedback(idx:number) {
    console.log('Submit feedback of answer');
    console.log('AnswerID = ' + idx);
    console.log('Feedback = ' + this.selectedFeedback[idx]);
    this.retrieveRankService.postfeedback(this.workOrder.issueText, this.answers[idx].answerID, this.selectedFeedback[idx]).subscribe(
      error => console.log(error)
    );
  }

  getDocumentUrl(): SafeUrl {
    if (this.selectedAnswer) {
      let url = this.answerUnitsService.buildGetAttachmentUrl(this.selectedAnswer._id, this.selectedAnswer.sourceTitle, 'application/pdf');
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      return null;
    }
  }
}

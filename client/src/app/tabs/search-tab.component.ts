import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { ModalDirective } from 'ng2-bootstrap';

import { RetrieverankService } from '../utils/retrieverank.service';
import { AnswerunitsService } from '../utils/answerunits.service';

declare var $:any;

@Component({
  selector: 'app-search-tab',
  template: `
  <div id="searchTab">
    <div class="row">
        <div id="searchWrapperColumn" class="col-sm-11 col-sm-offset-1 col-md-11 col-md-offset-1">
            <div id="searchContainer" class="vertical-align">
                <div id="searchColumn" class="col-sm-6 col-sm-offset-3 col-md-6 col-md-offset-3">
                    <form (keydown)="keyDownFunction($event)">
                      <div class="input-group">
                          <span id="searchIcon" class="input-group-addon">
                              <img src="assets/icons/search.svg" class="svg center-block" alt="Search Icon">
                          </span>
                          <input id="searchTextInput" type="text" class="form-control" #query (keyup)="onKey(query.value)">
                      </div>
                      <br>
                      <div id="searchInputGroup" class="input-group">
                          <div id="searchCheckbox" class="checkbox checkbox-info hidden">
                              <input type="checkbox" class="form-control" id="modelOnlyCheckbox" value="">
                              <label id="searchModelOnlyLabel" for="modelOnlyCheckbox">
                                  <!-- Search model only text -->
                              </label>
                          </div>
                      </div>
                    </form>
                </div>
            </div>
            <div id="searchResultsContainer">
                <div id="searchResultsCount" *ngIf="searchResultCount > 0">
                    <h4 class="page-header">{{searchResultCount}} results</h4>
                </div>
                <div id="searchResultsCount" *ngIf="searchResultCount == 0">
                    <h4 class="page-header">No search results found</h4>
                </div>

                <div id="searchResultsListContainer" *ngIf="resultsAvailable">
                    <div id="searchResultsList" *ngFor="let answer of searchResults; let i = index">
                        <button type="button" class="btn btn-link" (click)="showAnswerModal(i);">
                          <h3>{{answer.title}}</h3>
                        </button>
                        <h5>{{answer.answerId}}</h5>
                        <div>{{answer.bodySnippet}}</div>
                        <p>
                          <i class="fa fa-book"></i>
                          &nbsp;&nbsp;{{answer.sourceTitle}}
                        </p>
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
                 <!-- object class="e2e-trusted-url" class="pdf-viewer" [data]="getDocumentUrl()" type="application/pdf"></object -->
                 <div id="pdf" style="height: 100%; width: 100%">
                    <iframe [src]="getDocumentUrl()" style="height: 100%; width: 100%" frameborder="0" scrolling="no">
                         <p>It appears your web browser doesn't support iframes.</p>
                    </iframe>
                 </div>
               </div>
               <div id="searchResultDetailFooter" class="modal-footer">
                   <button class="btn btn-success pull-right" (click)="hideAnswerModal()">Close</button>
               </div>
           </div>
        </div>
     </div>
  </div>
  `
})
export class SearchTabComponent implements OnInit {

  @ViewChild('answerUnitAttachmentModal') public answerUnitAttachmentModal:ModalDirective;

  query:string;
  resultsAvailable:boolean = false;
  searchResults:any[] = [];
  searchResultCount:number;
  selectedAnswer:any;

  constructor(private sanitizer: DomSanitizer, private retrieveRankService: RetrieverankService, private answerUnitsService: AnswerunitsService) { }

  ngOnInit() {
  }

  showAnswerModal(idx:number) {
    this.selectedAnswer = this.searchResults[idx];
    this.answerUnitAttachmentModal.show();
  }

  hideAnswerModal() {
    this.selectedAnswer = null;
    this.answerUnitAttachmentModal.hide();
  }

  getDocumentUrl(): SafeUrl {
    if (this.selectedAnswer) {
      let url = this.answerUnitsService.buildGetAttachmentUrl(this.selectedAnswer._id, this.selectedAnswer.sourceTitle, 'application/pdf');
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      return null;
    }
  }

  onKey(value: string) {
    this.query = value;
  }

  keyDownFunction(event) {
    if(event.keyCode == 13) {
      this.resultsAvailable = false;
      if (this.query.trim().length == 0) return;
      this.retrieveRankService.query(this.query).subscribe(
        response => {
          console.log(response)
          this.searchResults = response.rankedAnswers;
          this.selectedAnswer = response.rankedAnswers[0];
          this.searchResultCount = response.answerCount;
          this.resultsAvailable = true;
        },
        error => console.log(error)
      );
    }
  }
}

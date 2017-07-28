import { Component, OnInit } from '@angular/core';

import { AnswerunitsService } from '../utils/answerunits.service'
import { AlertService } from '../utils/alert.service'

@Component({
  selector: 'app-au-admin-table',
  templateUrl: './au-admin-table.component.html'
})
export class AuAdminTableComponent implements OnInit {

  answerUnits;
  alert;
  showAlert:boolean = false;

  constructor(private answerUnitsService: AnswerunitsService, private alertService: AlertService) { }

  ngOnInit() {
    this.answerUnitsService.listAnswerUnits().subscribe(
      success => this.answerUnits = success,
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

  ngOnDestroy() {
  }
}

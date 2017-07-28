import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AnswerunitsService } from '../utils/answerunits.service'

@Component({
  selector: 'app-answerunit-admin',
  templateUrl: './answerunit-admin.component.html'
})
export class AnswerunitAdminComponent implements OnInit {

  sub;
  answerUnit;

  constructor(private router: Router, private route: ActivatedRoute, private answerUnitsService: AnswerunitsService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let id = params['id'];
      this.answerUnitsService.getAnswerUnit(id).subscribe(
        success => this.answerUnit = success,
        failure => console.log(failure)
      );
    });

  }

  saveAnswerUnit(answerUnitForm: NgForm) {
    this.router.navigate(['/home/admin-tab/au-admin-table']);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

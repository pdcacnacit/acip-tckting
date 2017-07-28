import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { WorkordersService } from '../utils/workorders.service'

@Component({
  selector: 'app-similarity-admin',
  templateUrl: './similarity-admin.component.html'
})
export class SimilarityAdminComponent implements OnInit {

  sub;
  similarity;

  constructor(private router: Router, private route: ActivatedRoute, private workordersService: WorkordersService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let id = params['id'];
      this.workordersService.getSimilarities(id).subscribe(
        success => this.similarity = success,
        failure => console.log(failure)
      );
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

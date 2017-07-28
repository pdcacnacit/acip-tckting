import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AnswerunitsService } from '../utils/answerunits.service'
import { AlertService } from '../utils/alert.service'

@Component({
  selector: 'app-doc-admin',
  templateUrl: './doc-admin.component.html'
})
export class DocAdminComponent implements OnInit {

  @ViewChild("fileInput") fileInput;
  reviewResponse;
  fileToUpload;

  constructor(private router: Router, private answerUnitsService: AnswerunitsService, private alertService: AlertService) { }

  ngOnInit() {
  }

  reviewDocument(docAdminForm: NgForm) {
    let formData: FormData = new FormData();
    let fi = this.fileInput.nativeElement;
    if (fi.files && fi.files[0]) {
      this.fileToUpload = fi.files[0];
      formData.append('file', this.fileToUpload);
      this.answerUnitsService.reviewDocument(formData).subscribe(
        success => {
          console.log(success);
          this.reviewResponse = success;
        },
        failure => console.log(failure)
      );
    }
  }

  indexDocument() {
    let formData: FormData = new FormData();
    formData.append('reviewResponse', JSON.stringify(this.reviewResponse))
    formData.append('file', this.fileToUpload);
    this.answerUnitsService.indexDocument(formData).subscribe(
      success => {
        this.alertService.setAlert('success', 'Document was successfully indexed')
        this.router.navigate(['/home/admin-tab/au-admin-table']);
      },
      failure => console.log(failure)
    );
  }
}

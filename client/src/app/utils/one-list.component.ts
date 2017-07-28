import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

export class NameValuePair {
  name:string
  value:string
  isSelected: false;

  constructor(_name:string, _value:string) {
    this.name = _name;
    this.value = _value;
  }
}

@Component({
  selector: 'app-one-list',
  template: `
    <div>
      <div class="row">
        <div class="form-group">
          <div class="col-sm-7 col-sm-offset-1">
            <input type="text" name="itemInput" id="itemInput" class="form-control" [(ngModel)]="selectedValue">
          </div>
          <div class="col-sm-3">
            <button type="button" class="btn btn-success" (click)="addItemToList()"><i class="fa fa-lg fa-plus" aria-hidden="true"></i></button>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-10 col-sm-offset-1">
          <ul class="list-group">
            <li class="list-group-item" [class.active]="nvp.isSelected"
              *ngFor="let nvp of listToManage; let i = index"
              (click)="setSelected(i)">
              <span>{{nvp.value}}
                <a class="pull-right" (click)="removeItem(i)"><i class="fa fa-trash" aria-hidden="true"></i></a>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    `
  ]
})
export class OneListComponent implements OnInit {

  @Input() listToManage = [];
  selectedIdx = 0;
  selectedValue;

  constructor() { }

  ngOnInit() {
    if (this.listToManage.length > 0) {
      this.listToManage[0].isSelected = true;
      this.selectedValue = this.listToManage[0].value;
    }
  }

  setSelected(i) {
    if (this.listToManage[this.selectedIdx]) {
      this.listToManage[this.selectedIdx].isSelected = false;
    }
    // Update the value in the list with the value in the input
    this.listToManage[this.selectedIdx].value = this.selectedValue;
    this.listToManage[this.selectedIdx].key = this.selectedValue;
    // Update the selected index
    this.listToManage[i].isSelected = true;
    this.selectedIdx = i;
    this.selectedValue = this.listToManage[i].value;
  }

  addItemToList() {
    this.listToManage.push(new NameValuePair(this.selectedValue, this.selectedValue));
  }

  keyDownFunction(event) {
  if(event.keyCode == 13) {
    alert('you just clicked enter');
    // rest of your code
  }
  }
  removeItem(i) {
    this.setSelected(i);
    this.listToManage.splice(i, 1);
    this.setSelected(0);
  }
}

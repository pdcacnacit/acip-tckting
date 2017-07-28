import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AlertService {

  private alert: any = {}

  constructor() { }

  private _alertSource: Subject<any> = new Subject<any>();

  getLatestAlert(): any {
    return this.alert;
  }

  getAlert(): Observable<any> {
    return this._alertSource.asObservable();
  }

  setAlert(type, msg) {
    this.alert.type = type
    this.alert.msg = msg
    this._alertSource.next(this.alert)
  }
}

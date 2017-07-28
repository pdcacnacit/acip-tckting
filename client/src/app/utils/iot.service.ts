import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

import { LoopbackLoginService } from '../auth/loopback/lb-login.service';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

const IOT_EMITTER_URL = '/api/iot-events'

@Injectable()
export class IotService {

  constructor(private http: Http, private authService:LoopbackLoginService) { }

  public pollEventEmitterStatus (interval:number) : Observable<any> {
    return Observable.interval(interval)
       .flatMap(() => {
         return this.getEventEmitterStatus();
       });
  }

  public getEventEmitterStatus () :  Observable<any> {
    let token = this.authService.get().token;
    let urlWithToken = IOT_EMITTER_URL + '/statusOfIoTEventEmitter' + '?access_token=' + token;
    let headers = new Headers({ 'Accept': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(urlWithToken, options)
       .map((res:Response) => {
         return res.json();
       })
       .catch((error:any) => {
         console.log(error);
         return Observable.throw(error.json().error || 'Server error')
       });

  }

  public startEventEmitter () :  Observable<any> {
    let token = this.authService.get().token;
    let urlWithToken = IOT_EMITTER_URL + '/startIoTEventEmitter' + '?access_token=' + token;
    let headers = new Headers({ 'Accept': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(urlWithToken, options)
       .map((res:Response) => {
         return res.json();
       })
       .catch((error:any) => {
         console.log(error);
         return Observable.throw(error.json().error || 'Server error')
       });

  }

}

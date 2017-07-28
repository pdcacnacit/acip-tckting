import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

import { LoopbackLoginService } from '../auth/loopback/lb-login.service';

import { CustomersService } from './customers.service';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

const WORKORDERS_URL = '/api/workorders';
const SERVICEHISTORY_URL = '/api/workorders/getServiceHistory';
const TROUBLESHOOTING_URL = '/api/similarities/getSimilarWorkOrders';
const SIMILARITIES_URL = '/api/similarities';
const COMPCODE_PREDICTION_URL = '/api/workorders/getComponentCodePrediction';

@Injectable()
export class WorkordersService {

  activeWorkOrder: any = {};

  constructor(private http: Http, private authService:LoopbackLoginService, private customersService: CustomersService) {
  }

  public saveWorkOrder(workOrder:any): Observable<any> {
    let token = this.authService.get().token;
    delete workOrder._rev;
    let urlWithToken = WORKORDERS_URL + '/' + workOrder.id + '?access_token=' + token;
    let headers = new Headers({ 'Accept': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put(urlWithToken, workOrder, options)
       .map((res:Response) => {
         return res.json();
       })
       .catch((error:any) => {
         console.log(error);
         return Observable.throw(error.json().error || 'Server error')
       });

  }

  public getWorkOrderIdList(): Observable<any> {

    let token = this.authService.get().token;
    let urlWithToken = WORKORDERS_URL + '?access_token=' + token;
    let headers = new Headers({ 'Accept': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(urlWithToken, options)
       .map((res:Response) =>  res.json())
       .catch((error:any) => Observable.throw(error.json().error || 'Server error'));

  }

  public getWorkOrderById(workOrderId:string): Observable<any> {

    let token = this.authService.get().token;
    let urlWithToken = WORKORDERS_URL + '/getWorkOrderById?access_token=' + token + '&id=' + workOrderId;
    let headers = new Headers({ 'Accept': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(urlWithToken, options)
       .map((res:Response) =>  res.json())
       .catch((error:any) => Observable.throw(error.json().error || 'Server error'));

  }

  public getOpenWorkOrders(): Observable<any> {
    let token = this.authService.get().token;
    let filter = { 'where': { 'isClosed' : false }};
    let urlWithToken = WORKORDERS_URL + '?access_token=' + token + '&filter=' + JSON.stringify(filter);
    return this.getWorkOrders(urlWithToken);
  }

  public getClosedWorkOrders(): Observable<any> {
    let token = this.authService.get().token;
    let filter = { 'where': { 'isClosed' : true }};
    let urlWithToken = WORKORDERS_URL + '?access_token=' + token + '&filter=' + JSON.stringify(filter);
    return this.getWorkOrders(urlWithToken);
  }

  public getAllWorkOrders(): Observable<any> {
    let token = this.authService.get().token;
    let urlWithToken = WORKORDERS_URL + '?access_token=' + token;
    return this.getWorkOrders(urlWithToken);
  }

  private getWorkOrders(url): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url, options)
       .map((res:Response) =>  res.json())
       .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  public getTroubleShootingWoList(id): Observable<any> {
    let token = this.authService.get().token;
    let urlWithToken = TROUBLESHOOTING_URL + '?access_token=' + token + '&id=' + id;

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(urlWithToken, options)
       .map((res:Response) =>  res.json())
       .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  public getSimilarities(id): Observable<any> {
    let token = this.authService.get().token;
    let urlWithToken = SIMILARITIES_URL + '/' + id + '?access_token=' + token;

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(urlWithToken, options)
       .map((res:Response) =>  res.json())
       .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  public getServiceHistory(workOrderIds:any): Observable<any> {
    let token = this.authService.get().token;
    let urlWithToken = SERVICEHISTORY_URL + '?access_token=' + token + '&ids=' + JSON.stringify(workOrderIds);

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(urlWithToken, options)
       .map((res:Response) =>  res.json())
       .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  public getComponentCodePrediction(workOrderId:string): Observable<any> {
    let token = this.authService.get().token;
    let urlWithToken = COMPCODE_PREDICTION_URL + '?access_token=' + token + '&id=' + workOrderId;

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(urlWithToken, options)
       .map((res:Response) =>  res.json())
       .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  public completeWorkOrder(workOrderId:string): Observable<any> {
    let token = this.authService.get().token;
    let urlWithToken = WORKORDERS_URL + '/completeWorkorder' + '?access_token=' + token;

    let request = {
      'workOrderId': workOrderId
    }

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(urlWithToken, request, options)
       .map((res:Response) =>  res.json())
       .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  // Observable workOrder source
  private _activeWorkOrderSource: Subject<any> = new Subject<any>();
  // Get the active work order observable
  getActiveWorkOrder(): Observable<any> {
    return this._activeWorkOrderSource.asObservable();
  }
  // service command
  setActiveWorkOrder(workOrder) {
    this.activeWorkOrder = workOrder;
    let customer = this.customersService.findCustomer(workOrder.customerName).subscribe(
      customer => {
        this.customersService.setActiveCustomer(customer);
        this._activeWorkOrderSource.next(workOrder);
      },
      error => {
        console.log(error);
      }
    );
  }
}

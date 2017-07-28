import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import { LoopbackLoginService } from '../auth/loopback/lb-login.service';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

const CUSTOMERS_URL = '/api/customers';

@Injectable()
export class CustomersService {

  activeCustomer:any = {};

  constructor(private http: Http, private authService:LoopbackLoginService) { }

  findCustomer(name:string): Observable<any> {
    let token = this.authService.get().token;
    let urlWithToken = CUSTOMERS_URL + '/' + encodeURIComponent(name) + '?access_token=' + token;

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(urlWithToken, options)
       .map((res:Response) => res.json())
       .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  setActiveCustomer(customer) {
    this.activeCustomer = customer;
  }

  getLineBrokenAddress(address):string {
    let brokenAddress = address;
    let commaIndex = address.indexOf(",");
    if (commaIndex > 0 && commaIndex < address.length - 1) {
        let firstLine = address.substr(0, commaIndex);
        let secondLine = address.substr(commaIndex + 1).trim();
        brokenAddress = firstLine + "<br>" + secondLine;
    }
    return brokenAddress;
  }

  saveCustomer(customer:any): Observable<any> {
    delete customer._rev;
    let token = this.authService.get().token;
    let urlWithToken = CUSTOMERS_URL + '/' + encodeURIComponent(customer.customerName) + '?access_token=' + token;

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put(urlWithToken, customer, options)
       .map((res:Response) =>  res.json())
       .catch((error:any) => Observable.throw(error.json().error || 'Server error'));

  }
}

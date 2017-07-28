import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { Subject }    from 'rxjs/Subject';

import { LoopbackLoginService } from '../auth/loopback/lb-login.service';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

const QUERY_URL = '/api/answerunits/query';

@Injectable()
export class RetrieverankService {

  constructor(private http: Http, private authService:LoopbackLoginService) { }

  query(query:string): Observable<any> {
    let token = this.authService.get().token;
    let urlWithToken = QUERY_URL + '?access_token=' + token + '&' + 'query=' + encodeURIComponent(query);

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(urlWithToken, options)
       .map((res:Response) => res.json())
       .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  postfeedback(query:string, ansID:number, feedback:number): Observable<any> {
    var IDans = ansID.toString();
    var reqbody = {
                  relevance : feedback,
                  question : query,
                  id : IDans
    };
    let headers = new Headers({ 'Content-Type': 'application/json',
                                'Authorization': 'Basic YWNpcGVuZHVzZXI6cGFzc3dvcmQ='});
    let options = new RequestOptions({ headers: headers });
    return this.http.post('https://acip-demo.mybluemix.net/rest/captureFeedback/', reqbody, options)
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }
}

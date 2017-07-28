import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import { LoopbackLoginService } from '../auth/loopback/lb-login.service';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

const ANSWERUNITS_BASE_URL = '/api/answerunits';
const ANSWERUNITS_REVIEWDOC_URL = '/api/answerunits/reviewDocument';
const ANSWERUNITS_INDEXDOC_URL = '/api/answerunits/indexDocument';
const ANSWERIDS_URL = '/api/answerunits/listAnswerIds';

@Injectable()
export class AnswerunitsService {

  public topAnswerId:string;

  constructor(private http: Http, private authService:LoopbackLoginService) { }

  public buildGetAttachmentUrl(id, fileName, contentType): string {
      let url = ANSWERUNITS_BASE_URL + '/getAttachment?access_token=' +
        this.authService.get().token +
        '&id=' + id +
        '&filename=' + fileName +
        '&contenttype=' + contentType;
      return url;
  }

  public listAnswerIds(): Observable<any> {
    let token = this.authService.get().token;
    let urlWithToken = ANSWERIDS_URL + '?access_token=' + token;

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(urlWithToken, options)
       .map((res:Response) => res.json())
       .catch((error:any) => Observable.throw(error.json().error || 'Server error'));

  }

  public listAnswerUnits(): Observable<any> {
    let token = this.authService.get().token;
    let urlWithToken = ANSWERUNITS_BASE_URL + '?access_token=' + token;

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(urlWithToken, options)
       .map((res:Response) => res.json())
       .catch((error:any) => Observable.throw(error.json().error || 'Server error'));

  }

  public getAnswerUnit(id): Observable<any> {
    let token = this.authService.get().token;
    let urlWithToken = ANSWERUNITS_BASE_URL + '/' + id + '?access_token=' + token;

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(urlWithToken, options)
       .map((res:Response) => res.json())
       .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  public reviewDocument(formData: FormData): Observable<any> {
    let token = this.authService.get().token;
    let urlWithToken = ANSWERUNITS_REVIEWDOC_URL + '?access_token=' + token;

    return this.http.post(urlWithToken, formData)
       .map((res:Response) => res.json())
       .catch((error:any) => Observable.throw(error.json().error || 'Server error'));

  }

  public indexDocument(formData: FormData): Observable<any> {
    let token = this.authService.get().token;
    let urlWithToken = ANSWERUNITS_INDEXDOC_URL + '?access_token=' + token;

    return this.http.post(urlWithToken, formData)
       .map((res:Response) => res.json())
       .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }
}

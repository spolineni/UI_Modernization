import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private http:HttpClient) { }

  pingBackend1() {
    return this.http.get('https://web-1ws-poc-fyq45uedja-uc.a.run.app/ping', {responseType: 'text'});
  }
  pingBackend2() {
    return this.http.get('https://etl-1ws-poc-fyq45uedja-uc.a.run.app/oneworldsync-productmatching/v1/ping', {responseType: 'text'});
  }
  pingBackend3() {
    return this.http.get('https://search-1ws-poc-fyq45uedja-uc.a.run.app/ping', {responseType: 'text'});
  }

  getDashboardData(header='', ascending: boolean) {
    console.log(`https://web-1ws-poc-fyq45uedja-uc.a.run.app/items/dashboard?sortField=${header}&ascending=${ascending}`);
    return this.http.get(`https://web-1ws-poc-fyq45uedja-uc.a.run.app/items/dashboard?sortField=${header}&ascending=${!ascending}`);
  }

  getDrilldownData(gtin) {
    return this.http.get(`https://web-1ws-poc-fyq45uedja-uc.a.run.app/items/${gtin}/drilldown`);
  }

  approveItems(items) {
    const options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.post('https://web-1ws-poc-fyq45uedja-uc.a.run.app/items/approve', JSON.stringify(items), {...options, responseType: 'text'});
  }

  getsignedUrl(request){
    const options = { headers: new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin','*') };
    return this.http.post(`https://web-1ws-poc-fyq45uedja-uc.a.run.app/upload-url/item-master`,JSON.stringify(request),options);
  }

  uploadFileToServer(url,request,file){
    const options = { headers: new HttpHeaders().set('Content-Type', 'application/octet-stream').set('x-goog-meta-user', JSON.parse(sessionStorage.getItem('user')).userName).set('Access-Control-Allow-Origin','*') };    
    return this.http.put(url,file,options);
  }

  getUploadFiles(){
    return this.http.get(`https://web-1ws-poc-fyq45uedja-uc.a.run.app/upload/files`);
  }
}


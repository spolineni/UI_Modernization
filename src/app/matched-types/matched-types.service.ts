import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatchedTypesService {

  constructor() { }

  dashboardItemData = new BehaviorSubject('');
  setDashboardItemData(dataObj: any) {
    this.dashboardItemData.next(dataObj);
  }
}

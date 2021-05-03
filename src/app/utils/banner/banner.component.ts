import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  constructor() { }
  private _success = new Subject<string>();
  staticAlertClosed = false;
  type;
  bannerMessage = '';

  ngOnInit(): void {
    setTimeout(() => this.staticAlertClosed = true, 20000);

    this._success.subscribe(message => this.bannerMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.bannerMessage = '');
  }

  changeSuccessMessage(message, type) {
    this._success.next(message);
    this.type = type;
  }

}

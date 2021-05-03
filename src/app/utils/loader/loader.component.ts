import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  isLoading: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  showLoader(val) {
    this.isLoading = val;
  }

}

import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import {TooltipPosition} from '@angular/material/tooltip';

@Component({
  selector: 'app-multiple-matches',
  templateUrl: './multiple-matches.component.html',
  styleUrls: ['./multiple-matches.component.scss']
})
export class MultipleMatchesComponent implements OnInit, AfterViewInit {
  @Input() expandedData;
  radioButton;
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  constructor() { }
  @Output() selectedItem: EventEmitter<any> = new EventEmitter<any>();
  ngOnInit(): void {
  }
  ngAfterViewInit() {
    console.log('init view')
  }

  radioSelect(gtin, item) {
    console.log(item);
    let obj = {gtin:gtin, itemData: item['ref-data']}
    this.selectedItem.emit(obj);
  }
}

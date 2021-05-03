import { Component, OnInit, Input } from '@angular/core';
import {TooltipPosition} from '@angular/material/tooltip';

@Component({
  selector: 'app-single-match',
  templateUrl: './single-match.component.html',
  styleUrls: ['./single-match.component.scss']
})
export class SingleMatchComponent implements OnInit {
  @Input() expandedData;
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  constructor() { }

  ngOnInit(): void {
  }


}

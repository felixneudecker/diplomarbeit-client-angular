import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-datasource-value',
  templateUrl: './datasource-value.component.html',
  styleUrls: ['./datasource-value.component.scss']
})
export class DatasourceValueComponent implements OnInit {
  value:number;

  @Input() i : number;
  @Input('val') val : number;

  constructor() { }

  ngOnInit() {
  }

}

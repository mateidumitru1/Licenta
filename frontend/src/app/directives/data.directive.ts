import {Directive, Input} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";

@Directive({
  selector: '[appData]'
})
export class DataDirective {

  data: any[] = [];

  constructor() { }

  @Input() set appData(data: any[]) {
    if (data) {
      this.data = data;
    }
  }
}

import {Directive, Input} from '@angular/core';

@Directive({
  selector: '[appDisplayedColumns]'
})
export class DisplayedColumnsDirective {

  columns: string[] = [];

  constructor() { }

  @Input() set appDisplayedColumns(columns: string[]) {
    if (columns) {
      this.columns = columns;
    }
  }
}

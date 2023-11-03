import {Directive, Input} from '@angular/core';

@Directive({
  selector: '[appIndex]'
})
export class IndexDirective {

  index: string = '';

  constructor() { }

  @Input() set appIndex(index: string) {
    if(index) {
      this.index = index;
    }
  }
}

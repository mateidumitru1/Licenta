import {Directive, Input} from '@angular/core';

@Directive({
  selector: '[appObjectType]'
})
export class ObjectTypeDirective {

  type: string = '';

  constructor() { }

  @Input() set appType(type: string) {
    if (type) {
      this.type = type;
    }
  }
}

import {Directive, Input} from '@angular/core';

@Directive({
  selector: '[appActions]'
})
export class ActionsDirective {

  actions: string[] = [];

  constructor() { }

  @Input() set appActions(actions: string[]) {
    if (actions) {
      this.actions = actions;
    }
  }
}

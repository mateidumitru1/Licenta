import {Component, OnDestroy, OnInit} from '@angular/core';
import {InputFieldsErrorService} from "./input-fields-error.service";

@Component({
  selector: 'app-input-fields-error',
  templateUrl: './input-fields-error.component.html',
  styleUrls: ['./input-fields-error.component.css']
})
export class InputFieldsErrorComponent implements OnInit {

  hidden: boolean = true;

  constructor(private inputFieldsErrorService: InputFieldsErrorService) { }

  ngOnInit() {
    this.inputFieldsErrorService.subject.subscribe(() => {
      this.show();
    });
  }

  show() {
    setTimeout(() => {
      this.hidden = true;
    }, 1000);
    this.hidden = false;
  }
}

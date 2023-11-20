import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AddService} from "../add.service";
import {EmailHandler} from "../../../../../../util/handlers/email.handler";
import {InputFieldsErrorService} from "../../../../../../shared/input-fields-error/input-fields-error.service";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit{

  @Output() confirmEvent: EventEmitter<any> = new EventEmitter<any>();

  user: {
    username: string,
    email: string,
    password: string,
    role: string,
    firstName: string,
    lastName: string,
  } = {} as any;

  constructor(private addService: AddService, private emailHandler: EmailHandler, private inputFieldsErrorService: InputFieldsErrorService) {}

  ngOnInit() {
    this.addService.subject.subscribe(() => {
      if(!(this.user.username && this.user.email && this.user.password && this.user.role && this.user.firstName && this.user.lastName)) {
        this.inputFieldsErrorService.subject.next('Please fill all the fields!');
      }
      else if(!this.emailHandler.isEmailValid(this.user.email)) {
        this.inputFieldsErrorService.subject.next('Email is not valid!');
      }
      else {
        this.confirmEvent.emit(this.user);
      }
    });
  }

}

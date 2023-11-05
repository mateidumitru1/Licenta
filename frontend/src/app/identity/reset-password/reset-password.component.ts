import {Component, OnInit} from '@angular/core';
import {InputFieldsErrorService} from "../../shared/input-fields-error/input-fields-error.service";
import {IdentityService} from "../identity.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit{

  newPassword: string = '';
  confirmPassword: string = '';

  token: string = '';

  constructor(private inputFieldsErrorService: InputFieldsErrorService, private identityService: IdentityService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.token = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
  }

  onClickConfirm() {
    if (this.newPassword !== this.confirmPassword) {
      this.inputFieldsErrorService.subject.next('Passwords do not match');
      return;
    }
    this.identityService.resetPassword(this.token, this.newPassword).subscribe(() => {
      alert('Password changed!');
    }, (error: any) => {
      alert(error.error);
    });
  }
}

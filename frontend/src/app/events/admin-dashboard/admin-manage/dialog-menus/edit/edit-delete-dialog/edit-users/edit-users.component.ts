import {Component, Input, OnInit} from '@angular/core';
import {IdentityService} from "../../../../../../../identity/identity.service";

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.css']
})
export class EditUsersComponent implements OnInit{

  @Input() userId: any = {};

  @Input() dialogRef: any = {};

  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    role: string;
  } = {
    id: '',
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    role: ''
  }

  toEditData: any = {};

  constructor(private identityService: IdentityService) { }

  ngOnInit() {
    this.identityService.fetchUserById(this.userId).subscribe((user: any) => {
      this.user = user;
      this.toEditData = {...this.user};
    });
  }
}

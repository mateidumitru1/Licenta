import {Component, OnInit} from '@angular/core';
import {JwtHandler} from "../../handlers/jwt.handler";
import {Router} from "@angular/router";

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {
  constructor(private jwtHandler: JwtHandler, private router: Router) { }

  ngOnInit() {
  }

  onClick() {
    if(this.jwtHandler.getRole() === 'ADMIN') {
      this.router.navigate(['/admin-dashboard']);
    }
    else {
      this.router.navigate(['/']);
    }
  }
}

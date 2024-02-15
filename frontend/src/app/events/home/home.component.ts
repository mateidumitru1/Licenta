import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {HomeService} from "./home.service";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  topEvents: any[] = [];

  constructor(private homeService: HomeService, private router: Router, private snackBar: MatSnackBar) {
  }
  ngOnInit(): void {
    this.homeService.fetchTopEvents().subscribe((events: any) => {
      this.topEvents = events;
    }, error => {
      this.snackBar.open('Error fetching top events', 'Close', { duration: 3000 });
    });
  }
}

import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router, RouterLink} from "@angular/router";
import {LocationService} from "./location.service";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {LoadingComponent} from "../../shared/loading/loading.component";
import {LoadingService} from "../../shared/loading/loading.service";
import {debounceTime, Subscription} from "rxjs";

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [
    NgForOf,
    LoadingComponent,
    NgIf,
    RouterLink,
    NgOptimizedImage
  ],
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss'
})
export class LocationComponent {

}

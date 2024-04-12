import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {LoadingService} from "./shared/loading/loading.service";
import {LoadingComponent} from "./shared/loading/loading.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Bileteria';
  loading!: boolean;
  showScrollButton = false;

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingService.loading$.subscribe(loading => {
      setTimeout(() => {
        this.loading = loading;
      }, 0);
    });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any): void {
    this.showScrollButton = window.scrollY > 500;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

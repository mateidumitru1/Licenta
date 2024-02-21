import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";

import {AsyncPipe, JsonPipe, NgIf} from "@angular/common";
import {LoadingComponent} from "../../shared/loading/loading.component";
import {NgxScannerQrcodeModule} from "ngx-scanner-qrcode";
import {BehaviorSubject, Subject, Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-validate',
  standalone: true,
  imports: [
    NgIf,
    JsonPipe,
    AsyncPipe,
    LoadingComponent,
    NgxScannerQrcodeModule,
  ],
  templateUrl: './scanner.component.html',
  styleUrl: './scanner.component.scss'
})
export class ScannerComponent implements AfterViewInit {
  cameraOpened = true;

  @ViewChild('action') action: any;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    this.action.data.subscribe((data: any) => {
      let url = data[0]
      if(url.value) {
        const parts = url.value.split('/');
        this.router.navigate([parts[1], parts[2], parts[3]]);
      }
    });
  }

  onStartClick() {
    if(this.action.isStart) {
      this.action.stop();
    } else {
      this.action.start()
    }
  }
}

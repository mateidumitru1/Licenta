import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";

import {AsyncPipe, JsonPipe, NgIf} from "@angular/common";
import {LoadingComponent} from "../../shared/loading/loading.component";
import {NgxScannerQrcodeModule} from "ngx-scanner-qrcode";
import {BehaviorSubject, Subject, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ValidateComponent} from "./validate/validate.component";

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
export class ScannerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('action') action: any;
  dialogRef: MatDialogRef<any> | null = null;

  constructor(private router: Router, private dialog: MatDialog) {}

  ngAfterViewInit(): void {
    this.action.data.subscribe((data: any) => {
      let url = data[0]
      if(url?.value) {
        this.action.stop();
        const ticketId = url.value;
        this.dialogRef = this.dialog.open(ValidateComponent, {
          data: ticketId
        });
        this.dialogRef.afterClosed().subscribe(() => {
          this.dialogRef = null;
          this.action.start();
        });
      }
    });
  }

  ngOnDestroy() {
    this.action.data.unsubscribe();
    if(this.dialogRef) {
      this.dialogRef.close();
    }
    if(this.action.isStart) {
      this.action.stop();
    }
  }

  onStartClick() {
    if(this.action.isStart) {
      this.action.stop();
    } else {
      this.action.start()
    }
  }
}

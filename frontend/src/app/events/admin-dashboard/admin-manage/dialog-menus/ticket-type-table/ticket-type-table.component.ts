import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {AddTicketTypeComponent} from "../add-dialog/add-event/add-ticket-type/add-ticket-type.component";
import {MatDialog} from "@angular/material/dialog";
import {TicketTypeService} from "./ticket-type.service";

@Component({
  selector: 'app-ticket-type-table',
  templateUrl: './ticket-type-table.component.html',
  styleUrls: ['./ticket-type-table.component.css']
})
export class TicketTypeTableComponent implements OnInit, OnChanges {

  @Input() ticketTypes: any[] = [];

  constructor(private dialog: MatDialog, private ticketTypeService: TicketTypeService) {}

  dataSource = new MatTableDataSource<any>();

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource.data = changes['ticketTypes'].currentValue;
  }

  onDeleteTicketTypeClick(ticketType: any) {
    this.dataSource.data = this.dataSource.data.filter(item => item !== ticketType);
    this.ticketTypeService.subject.next(this.dataSource.data);
  }

  onAddTicketTypeClick() {
    let dialogRef = this.dialog.open(AddTicketTypeComponent, {
      width: '40%',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.dataSource.data = [...this.dataSource.data, result];
        this.ticketTypeService.subject.next(this.dataSource.data);
      }
    });
  }
}

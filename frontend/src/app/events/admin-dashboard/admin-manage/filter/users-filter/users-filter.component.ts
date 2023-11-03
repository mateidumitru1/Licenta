import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-users-filter',
  templateUrl: './users-filter.component.html',
  styleUrls: ['./users-filter.component.css']
})
export class UsersFilterComponent {
  @Input() data: any = [];

  @Output() filteredDataEvent: EventEmitter<any[]> = new EventEmitter<any[]>();

  indexes: string[] = [];

  originalData: any = [];

  constructor() {}

  ngOnInit() {
    this.originalData = [...this.data];
    this.indexes = Object.keys(this.data[0]);
  }

  onDataFiltered(filteredData: any[]) {
    this.filteredDataEvent.emit(filteredData);
  }
}

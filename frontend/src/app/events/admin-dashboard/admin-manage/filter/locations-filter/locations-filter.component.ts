import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-locations-filter',
  templateUrl: './locations-filter.component.html',
  styleUrls: ['./locations-filter.component.css']
})
export class LocationsFilterComponent {

  @Input() data: any = [];

  @Output() filteredDataEvent: EventEmitter<any[]> = new EventEmitter<any[]>();

  indexes: string[] = [];

  originalData: any = [];

  constructor() {}

  ngOnInit() {
    this.originalData = [...this.data];
    this.indexes = Object.keys(this.data[0]);
    this.indexes.pop();
    this.indexes.pop();
  }

  onDataFiltered(filteredData: any[]) {
    this.filteredDataEvent.emit(filteredData);
  }
}

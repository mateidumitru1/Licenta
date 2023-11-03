import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit{

  @Input() data: any = [];

  @Input() type: string = '';

  @Output() filteredDataEvent: EventEmitter<any[]> = new EventEmitter<any[]>();

  indexes: string[] = [];

  selectedIndex: string = '';

  originalData: any = [];

  searchText: string = '';

  constructor() {}

  ngOnInit() {
    this.originalData = [...this.data];
    switch (this.type) {
      case 'users':{
        this.indexes = ['username', 'email', 'role'];
        break;
      }
      case 'locations':{
        this.indexes = ['name', 'address'];
        break;
      }
      case 'events':{
        this.indexes = ['title', 'location', 'date'];
        break;
      }
    }
    this.selectedIndex = this.indexes[0];
  }

  applyFilter() {
    const filteredData = this.originalData.filter((item: any) => {
      if(this.selectedIndex === 'date') {
        const dateAsString = new Date(item[this.selectedIndex]).toLocaleDateString('en-US');
        return dateAsString.toLowerCase().includes(this.searchText.trim().toLowerCase());
      }
      if(this.selectedIndex === 'location') {
        return item[this.selectedIndex].name.toLowerCase().includes(this.searchText.trim().toLowerCase());
      }
      return item[this.selectedIndex].toLowerCase().includes(this.searchText.trim().toLowerCase());
    });
    this.filteredDataEvent.emit(filteredData);
  }
}

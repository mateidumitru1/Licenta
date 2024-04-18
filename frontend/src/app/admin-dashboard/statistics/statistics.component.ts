import {Component, OnInit} from '@angular/core';
import {StatisticsService} from "./statistics.service";
import {Chart, registerables} from "chart.js";
import {NgForOf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

Chart.register(...registerables);


@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit {
  filter: string = 'all';

  locationWithAllEventsChart!: Chart;
  locationWithAvailableEventsChart!: Chart;
  eventsWithTicketsSoldChart!: Chart;

  statistics: any = {};

  predefinedColors = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
    '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
    '#aec7e8', '#ffbb78', '#98df8a', '#ff9896', '#c5b0d5',
    '#c49c94', '#f7b6d2', '#c7c7c7', '#dbdb8d', '#9edae5'
  ];

  locationsColors: any[] = [];

  cardStatistics: any[] = [];

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit() {
    this.statisticsService.fetchStatistics(this.filter).subscribe((statistics) => {
      this.statistics = statistics;
      this.locationsColors = this.statistics.locationsWithAllEventsCount.map((location: any) => {
        return { [location.location.name]: this.predefinedColors.pop() };
      });
      this.setCardStatistics();
      this.locationWithAllEventsChart = this.drawLocationsChart(this.statistics.locationsWithAllEventsCount, 'location-with-all-events-chart');
      this.locationWithAvailableEventsChart = this.drawLocationsChart(this.statistics.locationsWithAvailableEventsCount, 'location-with-available-events-chart');
      this.eventsWithTicketsSoldChart = this.drawEventsChart(this.statistics.eventsWithTicketsSoldCount, 'events-with-most-tickets-sold-chart');
    });
  }

  setCardStatistics() {
    this.cardStatistics = [
      {
        title: 'Numarul total de utilizatori adaugati',
        value: this.statistics.totalNumberOfUsers
      },
      {
        title: 'Numarul total de comenzi confirmate efectuate',
        value: this.statistics.totalNumberOfConfirmedOrders
      },
      {
        title: 'Numarul total de bilete vandute',
        value: this.statistics.totalNumberOfConfirmedTicketsSold
      },
      {
        title: 'Incasari',
        value: this.statistics.totalRevenue + ' RON'
      },
      {
        title: 'Numarul total de locatii adaugate',
        value: this.statistics.totalNumberOfLocations
      },
      {
        title: 'Numarul total de evenimente adaugate',
        value: this.statistics.totalNumberOfEvents
      },
      {
        title: 'Numarul total de evenimente adaugate disponibile',
        value: this.statistics.totalNumberOfAvailableEvents
      },
    ]
  }

  drawLocationsChart(locations: any[], chartId: string) {
    return new Chart(chartId, {
      type: 'bar',
      data: {
        labels: locations.map((location: any) => location.location.name),
        datasets: [{
          data: locations.map((location: any) => location.eventsCount),
          borderWidth: 1,
          backgroundColor: locations.map((location: any) => {
            const colorObj = this.locationsColors.find((color) => color.hasOwnProperty(location.location.name));
            return colorObj ? colorObj[location.location.name] : '';
          }),
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          }
        }
      },
    });
  }

  drawEventsChart(events: any[], chartId: string) {
     return new Chart(chartId, {
      type: 'bar',
      data: {
        labels: events.map((event: any) => event.event.title),
        datasets: [{
          data: events.map((event: any) => event.ticketsSoldCount),
          borderWidth: 1,
          backgroundColor: this.predefinedColors,
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          }
        }
      },
    });
  }

  refreshStatistics() {
    this.statisticsService.fetchStatistics(this.filter).subscribe((statistics) => {
      this.statistics = statistics;
      console.log(this.statistics);
      this.setCardStatistics();
      this.updateLocationsChart(this.locationWithAllEventsChart, this.statistics.locationsWithAllEventsCount);
      this.updateLocationsChart(this.locationWithAvailableEventsChart, this.statistics.locationsWithAvailableEventsCount);
      this.updateEventsChart(this.eventsWithTicketsSoldChart, this.statistics.eventsWithTicketsSoldCount);
    });
  }

  updateLocationsChart(chart: any, locations: any[]) {
    chart.data.labels = locations.map((location: any) => location.location.name);
    chart.data.datasets[0].data = locations.map((location: any) => location.eventsCount);
    chart.update();
  }

  updateEventsChart(chart: any, events: any[]) {
    chart.data.labels = events.map((event: any) => event.event.title);
    chart.data.datasets[0].data = events.map((event: any) => event.ticketsSoldCount);
    chart.update();
  }
}

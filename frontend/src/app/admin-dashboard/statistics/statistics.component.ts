import {Component, OnInit} from '@angular/core';
import {StatisticsService} from "./statistics.service";
import {Chart, registerables} from "chart.js";
import {NgForOf} from "@angular/common";

Chart.register(...registerables);


@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit {
  locationWithAllEventsChart: any = [];
  locationWithAvailableEventsChart: any = [];

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
    this.statisticsService.fetchStatistics().subscribe((statistics) => {
      this.statistics = statistics;
      this.locationsColors = this.statistics.locationsWithAllEventsCount.map((location: any) => {
        return { [location.location.name]: this.predefinedColors.pop() };
      });
      this.setCardStatistics();
      this.drawChart(this.locationWithAllEventsChart, this.statistics.locationsWithAllEventsCount, 'location-with-all-events-chart');
      this.drawChart(this.locationWithAvailableEventsChart, this.statistics.locationsWithAvailableEventsCount, 'location-with-available-events-chart');
    });
  }

  setCardStatistics() {
    this.cardStatistics = [
      {
        title: 'Numarul total de utilizatori',
        value: this.statistics.totalNumberOfUsers
      },
      {
        title: 'Numarul total de comenzi efectuate',
        value: this.statistics.totalNumberOfOrders
      },
      {
        title: 'Numarul total de bilete vandute',
        value: this.statistics.totalNumberOfTicketsSold
      },
      {
        title: 'Numarul total de locatii',
        value: this.statistics.totalNumberOfLocations
      },
      {
        title: 'Numarul total de evenimente',
        value: this.statistics.totalNumberOfEvents
      },
      {
        title: 'Numarul total de evenimente disponibile',
        value: this.statistics.totalNumberOfAvailableEvents
      },
    ]
  }

  drawChart(chart: any, locations: any[], chartId: string) {
    chart = new Chart(chartId, {
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
}

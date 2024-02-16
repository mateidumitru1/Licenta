import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TrackEventService} from "./track-event.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatListModule} from "@angular/material/list";
import {MatLineModule} from "@angular/material/core";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatCardModule} from "@angular/material/card";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonModule} from "@angular/material/button";
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import mapboxgl from "mapbox-gl";


@Component({
  selector: 'app-track-event',
  standalone: true,
  imports: [CommonModule, MatListModule, MatLineModule, MatGridListModule, MatCardModule, MatSidenavModule, MatButtonModule, RouterLink, RouterOutlet],
  templateUrl: './track-event.component.html',
  styleUrl: './track-event.component.css'
})
export class TrackEventComponent implements OnInit {

  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat: number = 0;
  lng: number = 0;

  tickets: any[] = [];

  upcomingTickets: any[] = [];

  upcomingEvents: any[] = [];

  constructor(private trackEventService: TrackEventService, private snackBar: MatSnackBar, private router: Router) {
  }

  ngOnInit() {
    this.fetchTickets();
    this.initMap();

  }

  fetchTickets() {
    this.trackEventService.fetchTickets().subscribe((tickets: any) => {
      this.tickets = tickets;
      const eventsMap: { [eventId: string]: boolean } = {};
      tickets.forEach((ticket: any) => {
        const event = ticket.ticketType.event;
        if (!eventsMap[event.id]) {
          eventsMap[event.id] = true;
          this.upcomingEvents.push(event);
        }
      });
      this.upcomingTickets = this.tickets.filter((ticket) => {
        const parts = ticket.ticketType.event.date.split('-');
        const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return date > new Date();
      });
    }, (error) => {
      this.snackBar.open('Error fetching tickets', 'Close', {duration: 3000,});
    });
  }

  initMap() {
    mapboxgl.accessToken = "pk.eyJ1IjoibWF0ZHVtIiwiYSI6ImNsc29uZXR3MTBlZ3oyaXA5dXdtOTRvOG4ifQ.cIPt8cb_-af1nuOvBazeGQ";

    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: 9,
        hash: true,
        center: [this.lng, this.lat]
      });

      this.map.addControl(new mapboxgl.NavigationControl());
      this.map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }));

      this.upcomingEvents.forEach((event) => {
        this.addMarker([event.location.longitude, event.location.latitude], event);
      });

    }, (error) => {
      this.snackBar.open('Error getting location', 'Close', {duration: 3000,});
    });
  }

  addMarker(coordinates: [number, number], event: any) {
    if (this.map instanceof mapboxgl.Map) {
      const marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<div class="popup-content">
            <h5 style="user-select: none; cursor: pointer;">${event.title}</h5>
            <p style="user-select: none; cursor: pointer;">${event.location.name} | ${event.date}</p>
            <button mat-raised-button class="view-details" color="primary">View details</button>
          </div>`
          )
        )
        .addTo(this.map);

      marker.getPopup().on('open', () => {
        const popupContent = marker.getPopup().getElement();
        const viewDetailsButton = popupContent?.querySelector('.view-details');
        const eventTitle = popupContent?.querySelector('h5');
        const location = popupContent?.querySelector('p');
        if (eventTitle) {
          eventTitle.addEventListener('click', (ev) => this.handleButtonClick([event.location.name,  event.title, event.id]));
        }
        if(location) {
          location.addEventListener('click', (ev) => this.handleButtonClick([event.location.name, event.location.id]));
        }
        if(viewDetailsButton) {
          viewDetailsButton.addEventListener('click', (ev) => this.handleButtonClick(['track', event.title, event.id]));
        }
      });
      marker.getPopup().on('close', () => {
        const popupContent = marker.getPopup().getElement();
        const viewDetailsButton = popupContent?.querySelector('.view-details');
        const eventTitle = popupContent?.querySelector('h5');
        const location = popupContent?.querySelector('p');
        if (eventTitle) {
          eventTitle.removeEventListener('click', (ev) => this.handleButtonClick(event));
        }
        if(location) {
          location.removeEventListener('click', (ev) => this.handleButtonClick(event));
        }
        if(viewDetailsButton) {
          viewDetailsButton.removeEventListener('click', (ev) => this.handleButtonClick(event));
        }
      });
    }
  }
  handleButtonClick(data: string[]) {
    const queryParams = {id: data[data.length - 1]};
    const routeSegments = data.slice(0, -1);
    this.router.navigate(['/', ...routeSegments], {queryParams});
  }
}

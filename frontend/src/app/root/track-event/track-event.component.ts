import {Component, OnInit} from '@angular/core';
import {mapBoxToken} from "../../app.config";
import mapboxgl from "mapbox-gl";
import {TrackEventService} from "./track-event.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-track-event',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './track-event.component.html',
  styleUrl: './track-event.component.scss'
})
export class TrackEventComponent implements OnInit{
  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat: number = 0;
  lng: number = 0;

  events: any[] = [];

  constructor(private trackEventService: TrackEventService, private router: Router) {}

  async ngOnInit() {
    await this.fetchBookedEvents();
    this.initMap();
  }

  async fetchBookedEvents() {
    await this.trackEventService.fetchBookedEvents();
    this.trackEventService.getBookedEvents().subscribe({
      next: (events: any) => {
        this.events = events;
      }
    });
  }


  initMap() {
    mapboxgl.accessToken = mapBoxToken;

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
      this.events.forEach((event) => {
        this.addMarker(event);
      });

    }, (error) => {
      console.error(error);
    });
  }

  addMarker(event: any) {
    if (this.map instanceof mapboxgl.Map) {
      const coordinates: [number, number] = [event.location.longitude, event.location.latitude];
      const marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<div class="popup-content">
            <h5 style="user-select: none; cursor: pointer;">${event.title}</h5>
            <p style="user-select: none; cursor: pointer;">${event.location.name} | ${event.date}</p>
            <button class="btn btn-primary view-details">View details</button>
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

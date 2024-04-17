import {Component, Inject, OnInit} from '@angular/core';
import mapboxgl from "mapbox-gl";
import {mapBoxToken} from "../../../../app.config";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit{
  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/streets-v11';

  constructor(public dialogRef: MatDialogRef<MapComponent>, @Inject(MAT_DIALOG_DATA) private data: any) {}

  destination: [number, number] = [0, 0];
  userLocation: [number, number] = [0, 0];

  ngOnInit() {
    mapboxgl.accessToken = mapBoxToken;
    this.destination = this.data.destination;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 11,
      center: [this.destination[0], this.destination[1]]
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    navigator.geolocation.getCurrentPosition(position => {
      this.userLocation = [position.coords.longitude, position.coords.latitude];

      this.addMarker([position.coords.longitude, position.coords.latitude]);

      this.calculateRoute();
    });

    this.addMarker([this.destination[0], this.destination[1]]);
  }

  addMarker(coordinates: [number, number]) {
    if (this.map instanceof mapboxgl.Map) {
      const marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<div class="popup-content">

          </div>`
          )
        )
        .addTo(this.map);
    }
  }
  calculateRoute() {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${this.userLocation[0]},${this.userLocation[1]};
    ${this.destination[0]},${this.destination[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const route = data.routes[0].geometry;
        this.map?.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: route
            }
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#888',
            'line-width': 8
          }
        });
      });
  }
}

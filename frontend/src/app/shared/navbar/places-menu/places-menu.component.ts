import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {NavbarService} from "../navbar.service";

@Component({
  selector: 'app-places-menu',
  templateUrl: './places-menu.component.html',
  styleUrls: ['./places-menu.component.css']
})
export class PlacesMenuComponent implements OnInit{

  places: {
    id: string,
    name: string,
    address: string,
    imageUrl: string
  }[] = [];

  constructor(private http: HttpClient, private router: Router, private navbarService: NavbarService) {
  }

  ngOnInit(): void {
    this.http.get('http://localhost:8080/api/places').subscribe((data: any) => {
      data.forEach(
        (place: {id: string, name: string, address: string, imageUrl: string}) => {
          this.places.push({
            id: place.id,
            name: place.name,
            address: place.address,
            imageUrl: place.imageUrl
          });
        }
      )
    }, (error) => {
      console.log(error);
    });
  }

  onPlaceClick(place: {id: string, name: string, address: string}) {
    this.navbarService.onClick();
    this.router.navigate(['/' + place.name], {queryParams: {id: place.id}});
  }
}

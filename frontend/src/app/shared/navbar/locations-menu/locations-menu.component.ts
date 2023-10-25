import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {NavbarService} from "../navbar.service";

@Component({
  selector: 'app-locations-menu',
  templateUrl: './locations-menu.component.html',
  styleUrls: ['./locations-menu.component.css']
})
export class LocationsMenuComponent implements OnInit{

  locations: {
    id: string,
    name: string,
    address: string,
    imageUrl: string
  }[] = [];

  constructor(private http: HttpClient, private router: Router, private navbarService: NavbarService) {
  }

  ngOnInit(): void {
    this.http.get('http://localhost:8080/api/locations').subscribe((data: any) => {
      data.forEach(
        (location: {id: string, name: string, address: string, imageUrl: string}) => {
          this.locations.push({
            id: location.id,
            name: location.name,
            address: location.address,
            imageUrl: location.imageUrl
          });
        }
      )
    }, (error) => {
      console.log(error);
    });
  }

  onPlaceClick(location: {id: string, name: string, address: string}) {
    this.navbarService.onClick();
    this.router.navigate(['/' + location.name], {queryParams: {id: location.id}});
  }
}

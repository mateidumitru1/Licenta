import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  places: {
    id: string,
    name: string,
    address: string
  }[] = [];

  constructor(private http: HttpClient, private router: Router) {
  }
  ngOnInit(): void {
    this.http.get('http://localhost:8080/api/places',
      {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).subscribe((data: any) => {
        data.forEach(
          (place: {id: string, name: string, address: string}) => {
            this.places.push({
              id: place.id,
              name: place.name,
              address: place.address
            });
          }
        )
    }, (error) => {
      console.log(error);
    });
  }

  onPlaceClick(place: {id: string, name: string, address: string}) {
    this.router.navigate(['/' + place.name]);
  }
}

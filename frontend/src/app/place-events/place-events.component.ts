import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-place-events',
  templateUrl: './place-events.component.html',
  styleUrls: ['./place-events.component.css']
})
export class PlaceEventsComponent implements OnInit{

  events: {
    id: string,
    title: string,
    shortDescription: string,
    description: string,
    date: string,
    place: {
      id: string,
      name: string,
      address: string
    }
  }[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get('http://localhost:8080/api/events/place?placeName=' + this.router.url.split('/')[1],
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).subscribe((data: any) => {
        data.forEach((data: any) => {
          this.events.push({
            id: data.id,
            title: data.title,
            shortDescription: data.shortDescription,
            description: data.description,
            date: data.date,
            place: {
              id: data.place.id,
              name: data.place.name,
              address: data.place.address
            }
          });
          this.events.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateA - dateB;
          })

        });
    }, (error) => {
        console.log(error);
    });
  }
}

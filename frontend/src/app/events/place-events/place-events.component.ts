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
      address: string,
      imageUrl: string
    },
    imageUrl: string
  }[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get('http://localhost:8080/api/events/place?placeName=' + this.router.url.split('/')[1],
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).subscribe((events: any) => {
      events.forEach((event: any) => {
          this.events.push({
            id: event.id,
            title: event.title,
            shortDescription: event.shortDescription,
            description: event.description,
            date: event.date,
            place: {
              id: event.place.id,
              name: event.place.name,
              address: event.place.address,
              imageUrl: event.place.imageUrl
            },
            imageUrl: event.imageUrl
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

  onEventClick(event: any) {
    this.router.navigate(['/' + event.place.name + '/' + event.title]);
  }
}
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class PlaceEventsService {

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

  constructor(private http: HttpClient) {}

  fetchEvents(placeName: string): void {
    this.events = [];
    this.http.get('http://localhost:8080/api/events/place?placeName=' + placeName,
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
        });
      });
    }, (error) => {
      console.log(error);
    });
  }

  getEvents(): any {
    return this.events;
  }
}

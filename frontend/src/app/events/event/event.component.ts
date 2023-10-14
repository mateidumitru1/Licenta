import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  event: {
    id: string;
    title: string;
    shortDescription: string;
    description: string;
    date: string;
    place: {
      id: string;
      name: string;
      address: string;
      imageUrl: string;
    };
    imageUrl: string;
  } = {
    id: '',
    title: '',
    shortDescription: '',
    description: '',
    date: '',
    place: {
      id: '',
      name: '',
      address: '',
      imageUrl: ''
    },
    imageUrl: ''
  };

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.http.get('http://localhost:8080/api/events?title=' + this.router.url.split('/')[2],
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).subscribe((data: any) => {
        this.event = {
          id: data.id,
          title: data.title,
          shortDescription: data.shortDescription,
          description: data.description,
          date: data.date,
          place: {
            id: data.place.id,
            name: data.place.name,
            address: data.place.address,
            imageUrl: data.place.imageUrl
          },
          imageUrl: data.imageUrl
        }
    }, (error) => {
        console.log(error);
    });
  }
}

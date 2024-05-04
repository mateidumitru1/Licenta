import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable, OnDestroy} from "@angular/core";
import {apiURL} from "../../app.config";
import {BehaviorSubject, lastValueFrom} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventSubject = new BehaviorSubject<any>({});
  private eventListSubject = new BehaviorSubject<any>({});

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  setEvent(event: any) {
    this.eventSubject.next(event);
  }

  getEvent() {
    return this.eventSubject.asObservable();
  }

  async fetchEventById(id: string) {
    try {
      const event = await lastValueFrom(this.http.get(apiURL + '/events/' + id));
      this.setEvent(event);
    }
    catch (error) {
      this.snackBar.open('Failed to fetch event', 'Close', {duration: 3000});
    }
  }

  setEventList(locations: any) {
    this.eventListSubject.next(locations);
  }

  getEventList() {
    return this.eventListSubject.asObservable();
  }

  async fetchEventList(locationName: string | undefined,
                       artistName: string | undefined,
                       genreName: string | undefined,
                       startDate: string | undefined,
                       endDate: string | undefined,
                       page: number,
                       size: number) {
    try {
      let params = new HttpParams();
      if (locationName !== undefined) {
        params = params.append('location', locationName);
      }
      if (artistName !== undefined) {
        params = params.append('artist', artistName);
      }
      if (genreName !== undefined) {
        params = params.append('genre', genreName);
      }
      if (startDate !== undefined) {
        params = params.append('startDate', startDate);
      }
      if (endDate !== undefined) {
        params = params.append('endDate', endDate);
      }
      params = params.append('page', page.toString());
      params = params.append('size', size.toString());
      const eventList: any = await lastValueFrom(this.http.get(apiURL + '/events/list',  {params: params}));
      if(page === 0) {
        this.setEventList(eventList);
      }
      else {
        const currentEvents = this.eventListSubject.getValue();
        const updatedEvents = {
          ...currentEvents,
          content: [...currentEvents.content, ...eventList.content]
        };
        this.setEventList(updatedEvents);
      }
      return eventList.content.length;
    }
    catch (error) {
      console.error(error);
      this.snackBar.open('Error fetching events', 'Close', {
        duration: 3000
      });
    }
  }
}

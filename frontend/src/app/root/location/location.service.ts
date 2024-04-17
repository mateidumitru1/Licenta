import {Injectable, OnDestroy} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../app.config";
import {BehaviorSubject, lastValueFrom, Subscription} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private locationSubject = new BehaviorSubject<any>({});
  private moreEventsSubject = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  setLocation(locations: any) {
    this.locationSubject.next(locations);
  }

  getLocation() {
    return this.locationSubject.asObservable();
  }

  setMoreEvents(events: any[]) {
    this.moreEventsSubject.next(events);
  }

  getMoreEvents() {
    return this.moreEventsSubject.asObservable();
  }

  async fetchLocationWithInitialEventsByLocationId(id: string, page: number, size: number) {
    try {
      const location: any = await lastValueFrom(this.http.get(apiURL + '/events/location/' + id + '/initial', {
        params: {
          page: page.toString(),
          size: size.toString()
        }
      }));
      this.setLocation(location);
    }
    catch (error) {
      this.snackBar.open('Error fetching location with initial events', 'Close', {
        duration: 3000
      });
    }
  }

  async fetchMoreEventsByLocationId(id: string, page: number, size: number) {
    try {
      const moreEvents: any = await lastValueFrom(this.http.get(apiURL + '/events/location/' + id, {
        params: {
          page: page.toString(),
          size: size.toString()
        }
      }));
      console.log(moreEvents);
      this.setMoreEvents(moreEvents);
    }
    catch (error) {
      this.snackBar.open('Error fetching more events', 'Close', {
        duration: 3000
      });
    }
  }
}

import {Injectable, OnDestroy} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {apiURL} from "../../app.config";
import {BehaviorSubject, lastValueFrom, Subscription} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {query} from "@angular/animations";

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private eventListSubject = new BehaviorSubject<any>({});

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  setLocation(locations: any) {
    this.eventListSubject.next(locations);
  }

  getLocation() {
    return this.eventListSubject.asObservable();
  }

  async fetchEventList(locationName: string, artistName: string, genreName: string, page: number, size: number) {
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
      params = params.append('page', page.toString());
      params = params.append('size', size.toString());
      const location: any = await lastValueFrom(this.http.get(apiURL + '/events/list',  {params: params}));
      this.setLocation(location);
    }
    catch (error) {
      this.snackBar.open('Error fetching location with initial events', 'Close', {
        duration: 3000
      });
    }
  }
}

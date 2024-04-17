import {HttpClient} from "@angular/common/http";
import {Injectable, OnDestroy} from "@angular/core";
import {apiURL} from "../../app.config";
import {BehaviorSubject, lastValueFrom} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventSubject = new BehaviorSubject<any>({});

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
}

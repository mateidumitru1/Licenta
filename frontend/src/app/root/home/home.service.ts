import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../app.config";
import {Injectable, OnDestroy} from "@angular/core";
import {JwtHandler} from "../../identity/jwt.handler";
import {BehaviorSubject, lastValueFrom, Subscription} from "rxjs";
import {IdentityService} from "../../identity/identity.service";

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private homeEventsSubject = new BehaviorSubject<any>({recommendedEvents: [], selectedEvents: []});

  constructor(private http: HttpClient, private identityService: IdentityService) { }

  setHomeEvents(homeEvents: any) {
    this.homeEventsSubject.next(homeEvents);
  }

  getHomeEvents() {
    return this.homeEventsSubject.asObservable();
  }

  async fetchHomeEvents() {
    const token = this.identityService.getToken();
    if (!token) {
      try {
        const homeEvents = await lastValueFrom(this.http.get(apiURL + '/events/home'));
        this.setHomeEvents(homeEvents);
      }
      catch (error) {
        console.error('Error fetching recommended events', error);
      }
    }
    else {
      try {
        const homeEvents = await lastValueFrom(this.http.get(apiURL + '/events/home', {
          headers: {
            'Authorization': 'Bearer ' + this.identityService.getToken()
          }
        }));
        this.setHomeEvents(homeEvents);
      }
      catch (error) {
        console.error('Error fetching recommended events', error);
      }
    }
  }
}

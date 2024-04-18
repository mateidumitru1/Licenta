import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../../app.config";
import {getFormData} from "../shared/form-data.handler";
import {BehaviorSubject, lastValueFrom} from "rxjs";
import {IdentityService} from "../../../identity/identity.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class ManageEventsService {
  private eventListSubject = new BehaviorSubject<any>({});

  constructor(private http: HttpClient, private identityService: IdentityService, private snackBar: MatSnackBar) {}

  setEventsListSubject(events: any) {
    this.eventListSubject.next(events);
  }

  getEventsListSubject() {
    return this.eventListSubject;
  }

  async fetchPaginatedEvents(page: number, size: number) {
    try {
      const response = await lastValueFrom(this.http.get(apiURL + '/events', {
        params: {
          page: page.toString(),
          size: size.toString()
        },
        headers: {
          Authorization: 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.setEventsListSubject(response);
    }
    catch (error) {
      this.snackBar.open('Failed to fetch events', 'Close', {
        duration: 3000,
      });
    }
  }

  async fetchPaginatedEventsFiltered(page: number, size: number, filter: string, search: string) {
    try {
      const response = await lastValueFrom(this.http.get(apiURL + '/events/filtered', {
        params: {
          page: page.toString(),
          size: size.toString(),
          filter: filter,
          search: search
        },
        headers: {
          Authorization: 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.setEventsListSubject(response);
    }
    catch (error) {
      this.snackBar.open('Failed to fetch events', 'Close', {
        duration: 3000,
      });
    }
  }

  async addEvent(event: any, page: number, size: number) {
    try {
      const response = await lastValueFrom(this.http.post(apiURL + '/events', getFormData(event), {
        params: {
          page: page.toString(),
          size: size.toString()
        },
        headers: {
          Authorization: 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.setEventsListSubject(response);
    }
    catch (error) {
      this.snackBar.open('Failed to add event', 'Close', {
        duration: 3000,
      });
    }
  }

  async updateEvent(event: any) {
    try {
      const response = await lastValueFrom(this.http.put(apiURL + '/events', getFormData(event), {
        headers: {
          Authorization: 'Bearer ' + this.identityService.getToken()
        }
      }));
      let events = this.eventListSubject.getValue();
      events.eventPage.content = events.eventPage.content.map((e: any) => e.id === event.id ? event : e);
      this.setEventsListSubject(events);
    }
    catch (error) {
      this.snackBar.open('Failed to update event', 'Close', {
        duration: 3000,
      });
    }
  }

  async deleteEvent(id: string, page: number, size: number) {
    try {
      const response = await lastValueFrom(this.http.delete(apiURL + `/events/${id}`, {
        params: {
          page: page.toString(),
          size: size.toString()
        },
        headers: {
          Authorization: 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.setEventsListSubject(response);
    }
    catch (error) {
      this.snackBar.open('Failed to delete event', 'Close', {
        duration: 3000,
      });
    }
  }

  async fetchEventById(eventId: string) {
    return await lastValueFrom(this.http.get(apiURL + `/events/` + eventId, {
      headers: {
        Authorization: 'Bearer ' + this.identityService.getToken()
      }
    }));
  }

  async fetchAllBroadGenres() {
    return await lastValueFrom(this.http.get(apiURL + '/broad-genres', {
      headers: {
        Authorization: 'Bearer ' + this.identityService.getToken()
      }
    }));
  }
}


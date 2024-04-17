import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../app.config";
import {JwtHandler} from "../../identity/jwt.handler";
import {BehaviorSubject, lastValueFrom} from "rxjs";
import {IdentityService} from "../../identity/identity.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class HomeAdminService {
  private selectedEventListSubject = new BehaviorSubject<any[]>([]);
  private eventListForSelectionSubject = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient, private identityService: IdentityService, private snackBar: MatSnackBar) { }

  setSelectedEventList(selectedEventList: any[]) {
    this.selectedEventListSubject.next(selectedEventList);
  }

  getSelectedEventList() {
    return this.selectedEventListSubject.asObservable();
  }

  setEventListForSelection(eventListForSelection: any[]) {
    this.eventListForSelectionSubject.next(eventListForSelection);
  }

  getEventListForSelection() {
    return this.eventListForSelectionSubject.asObservable();
  }

  async fetchEventListForSelection() {
    try {
      const eventListForSelection: any = await lastValueFrom(this.http.get(apiURL + '/events/all-for-selection', {
        headers: {
          Authorization: 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.setEventListForSelection(eventListForSelection);
    }
    catch (error) {
      this.snackBar.open('Failed to fetch event list for selection', 'Close', {
        duration: 3000
      });
    }
  }

  async fetchSelectedEvents() {
      try {
        const selectedEvents: any = await lastValueFrom(this.http.get(apiURL + '/events/selected'));
        this.setSelectedEventList(selectedEvents);
      }
      catch (error) {
        this.snackBar.open('Failed to fetch selected events', 'Close', {
          duration: 3000
        });
      }
  }

  async addSelectedEventList(selectedEventIdList: any) {
    try {
      const addedSelectedEvents: any = await lastValueFrom(this.http.post(apiURL + '/events/select', selectedEventIdList, {
        headers: {
          'Authorization': 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.setSelectedEventList([...this.selectedEventListSubject.value, ...addedSelectedEvents]);
    }
    catch (error) {
      this.snackBar.open('Failed to add selected events', 'Close', {
        duration: 3000
      });
    }
  }

  async deleteSelectedEvent(id: string) {
    try {
      const deletedSelectedEvents = await lastValueFrom(this.http.delete(apiURL + '/events/deselect/' + id, {
        headers: {
          'Authorization': 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.setSelectedEventList(this.selectedEventListSubject.value.filter(event => event.id !== id));
    }
    catch (error) {
      this.snackBar.open('Failed to delete selected event', 'Close', {
        duration: 3000
      });
    }
  }
}

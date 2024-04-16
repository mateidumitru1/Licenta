import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../../app.config";
import {getFormData} from "../shared/form-data.handler";
import {JwtHandler} from "../../../identity/jwt.handler";

@Injectable({
  providedIn: 'root'
})
export class ManageEventsService {

  constructor(private http: HttpClient, private jwtHandler: JwtHandler) {}

  fetchPaginatedEvents(page: number, size: number) {
    return this.http.get(apiURL + '/events', {
      params: {
        page: page.toString(),
        size: size.toString()
      },
      headers: {
        Authorization: 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }

  fetchPaginatedEventsFiltered(page: number, size: number, filter: string, search: string) {
    return this.http.get(apiURL + '/events/filtered', {
      params: {
        page: page.toString(),
        size: size.toString(),
        filter: filter,
        search: search
      },
      headers: {
        Authorization: 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }

  fetchEventForSelection() {
    return this.http.get(apiURL + '/events/all-for-selection', {
      headers: {
        Authorization: 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }

  addEvent(event: any, page: number, size: number) {
    return this.http.post(apiURL + '/events', getFormData(event), {
      params: {
        page: page.toString(),
        size: size.toString()
      },
      headers: {
        Authorization: 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }

  updateEvent(event: any) {
    return this.http.put(apiURL + '/events', getFormData(event), {
      headers: {
        Authorization: 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }

  deleteEvent(id: string, page: number, size: number) {
    return this.http.delete(apiURL + `/events/${id}`, {
      params: {
        page: page.toString(),
        size: size.toString()
      },
      headers: {
        Authorization: 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }

  fetchEventById(eventId: string) {
    return this.http.get(apiURL + `/events/` + eventId, {
      headers: {
        Authorization: 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }
}


import {EventEmitter, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {EventService} from "../../event/event.service";
import {LocationService} from "../../location/location.service";

@Injectable({providedIn: 'root'})
export class AdminManageService {

  constructor(private http: HttpClient, private eventService: EventService, private locationService: LocationService) {
  }

  fetchUsers(): Observable<any> {
    return this.http.get('http://localhost:8080/api/users', {
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}
      }
    );
  }

  fetchEvents(): Observable<any> {
    return this.eventService.fetchAllEvents();
  }

  fetchLocations(): Observable<any> {
    return this.locationService.fetchAllLocations();
  }

  update(objectType: string, data: any): Observable<any> {
    return this.http.patch(`http://localhost:8080/api/${objectType}`, this.getFormData(objectType, data),
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        },
      });
  }

  delete(objectType: string, id: string): Observable<any> {
    return this.http.delete(`http://localhost:8080/api/${objectType}/${id}`,
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });
  }

  add(objectType: string, data: any) {
    return this.http.post(`http://localhost:8080/api/${objectType}`, this.getFormData(objectType, data),
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });
  }

  getFormData(objectType: string, data: any) {
    const formData = new FormData();

    if (objectType === 'events') {
      const date: Date = new Date(data.date);
      formData.append('locationId', data.location.id);
      formData.append('date', date.toISOString());
    }
    for (let key in data) {
      if (key === 'location' || key === 'date') {
        continue;
      }
      if (key === 'ticketTypes') {
        formData.append(key, JSON.stringify(data[key]));
        continue;
      }
      formData.append(key, data[key]);
    }
    return formData;
  }

  fetchOrderById(id: string) {
    return this.http.get(`http://localhost:8080/api/orders/` + id,
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });
  }

  fetchOrdersByUserId(userId: string) {
    return this.http.get(`http://localhost:8080/api/orders/user/` + userId,
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });
  }
}


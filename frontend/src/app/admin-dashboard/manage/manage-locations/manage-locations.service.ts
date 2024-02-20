import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../../app.config";
import {getFormData} from "../shared/form-data.handler";

@Injectable({
  providedIn: 'root'
})
export class ManageLocationsService {
  constructor(private http: HttpClient) {}

  fetchLocations() {
    return this.http.get(apiURL + '/locations');
  }
  addLocation(location: any) {
    return this.http.post(apiURL + '/locations', getFormData(location), {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    });
  }

  editLocation(location: any) {
    return this.http.patch(apiURL + '/locations', getFormData(location), {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    });
  }

  deleteLocation(id: string) {
    return this.http.delete(apiURL + `/locations/${id}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    });
  }
}

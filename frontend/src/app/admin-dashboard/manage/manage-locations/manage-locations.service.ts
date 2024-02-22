import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../../app.config";
import {getFormData} from "../shared/form-data.handler";
import {JwtHandler} from "../../../identity/jwt.handler";

@Injectable({
  providedIn: 'root'
})
export class ManageLocationsService {
  constructor(private http: HttpClient, private jwtHandler: JwtHandler) {}

  fetchLocations() {
    return this.http.get(apiURL + '/locations');
  }
  addLocation(location: any) {
    return this.http.post(apiURL + '/locations', getFormData(location), {
      headers: {
        Authorization: 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }

  editLocation(location: any) {
    return this.http.patch(apiURL + '/locations', getFormData(location), {
      headers: {
        Authorization: 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }

  deleteLocation(id: string) {
    return this.http.delete(apiURL + `/locations/${id}`, {
      headers: {
        Authorization: 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }
}

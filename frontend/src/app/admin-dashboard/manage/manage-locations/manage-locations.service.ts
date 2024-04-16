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

  fetchPaginatedLocations(page: number, size: number) {
    return this.http.get(apiURL + '/locations', {
      params: {
        page: page.toString(),
        size: size.toString()
      },
      headers: {
        Authorization: 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }

  fetchPaginatedLocationsFiltered(page: number, size: number, filter: string, search: string) {
    return this.http.get(apiURL + '/locations/filtered', {
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

  addLocation(location: any, page: number, size: number) {
    return this.http.post(apiURL + '/locations', getFormData(location), {
      params: {
        page: page.toString(),
        size: size.toString()
      },
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

  deleteLocation(id: string, page: number, size: number) {
    return this.http.delete(apiURL + `/locations/${id}`, {
      params: {
        page: page.toString(),
        size: size.toString()
      },
      headers: {
        Authorization: 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }

  fetchAllLocations() {
    return this.http.get(apiURL + '/locations/all', {
      headers: {
        Authorization: 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }
}

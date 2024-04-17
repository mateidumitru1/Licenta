import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../../app.config";
import {getFormData} from "../shared/form-data.handler";
import {IdentityService} from "../../../identity/identity.service";
import {BehaviorSubject, lastValueFrom} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class ManageLocationsService {
  private locationListSubject = new BehaviorSubject<any>({});

  constructor(private http: HttpClient, private identityService: IdentityService, private snackBar: MatSnackBar) {}

  setLocationsListSubject(data: any) {
    this.locationListSubject.next(data);
  }

  getLocationsListSubject() {
    return this.locationListSubject.asObservable();
  }

  async fetchPaginatedLocations(page: number, size: number) {
    try {
      const response = await lastValueFrom(this.http.get(apiURL + '/locations', {
        params: {
          page: page.toString(),
          size: size.toString()
        },
        headers: {
          Authorization: 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.setLocationsListSubject(response);
    }
    catch (error) {
      this.snackBar.open('Error fetching locations', 'Close', {
        duration: 3000
      });
    }
  }

  async fetchPaginatedLocationsFiltered(page: number, size: number, filter: string, search: string) {
    try {
      const response = await lastValueFrom(this.http.get(apiURL + '/locations/filtered', {
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
      this.setLocationsListSubject(response);
    }
    catch (error) {
      this.snackBar.open('Error fetching locations', 'Close', {
        duration: 3000
      });
    }
  }

  async addLocation(location: any, page: number, size: number) {
    try {
      const response = await lastValueFrom(this.http.post(apiURL + '/locations', getFormData(location), {
        params: {
          page: page.toString(),
          size: size.toString()
        },
        headers: {
          Authorization: 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.setLocationsListSubject(response);
    }
    catch (error) {
      this.snackBar.open('Error adding location', 'Close', {
        duration: 3000
      });
    }
  }

  async editLocation(location: any) {
    try {
      const response = await lastValueFrom(this.http.patch(apiURL + '/locations', getFormData(location), {
        headers: {
          Authorization: 'Bearer ' + this.identityService.getToken()
        }
      }));
      let locations = this.locationListSubject.getValue();
      locations.locationPage.content = locations.locationPage.content.map((l: any) => l.id === location.id ? location : l);
      this.setLocationsListSubject(locations);
    }
    catch (error) {
      this.snackBar.open('Error editing location', 'Close', {
        duration: 3000
      });
    }
  }

  async deleteLocation(id: string, page: number, size: number) {
    try {
      const response = await lastValueFrom(this.http.delete(apiURL + `/locations/${id}`, {
        params: {
          page: page.toString(),
          size: size.toString()
        },
        headers: {
          Authorization: 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.setLocationsListSubject(response);
    }
    catch (error) {
      this.snackBar.open('Error deleting location', 'Close', {
        duration: 3000
      });
    }
  }

  async fetchAllLocations() {
    return await lastValueFrom(this.http.get(apiURL + '/locations/all', {
      headers: {
        Authorization: 'Bearer ' + this.identityService.getToken()
      }
    }));
  }
}

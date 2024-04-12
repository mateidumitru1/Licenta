import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../../app.config";
import {Observable} from "rxjs";
import {getFormData} from "../shared/form-data.handler";
import {JwtHandler} from "../../../identity/jwt.handler";

@Injectable({
  providedIn: 'root'
})
export class ManageUsersService {
  constructor(private http: HttpClient, private jwtHandler: JwtHandler) {}

  fetchPaginatedUsers(page: number, size: number) {
    return this.http.get(apiURL + '/users', {
      params: {
        page: page.toString(),
        size: size.toString()
      },
      headers: {
        'Authorization': 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }

  fetchPaginatedUsersFiltered(page: number, size: number, filter: string, search: string) {
    return this.http.get(apiURL + '/users/filtered', {
      params: {
        page: page.toString(),
        size: size.toString(),
        filter: filter,
        search: search
      },
      headers: {
        'Authorization': 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }

  addUser(user: any) {
    return this.http.post(apiURL + '/users', getFormData(user), {
      headers: {
        Authorization: 'Bearer ' + this.jwtHandler.getToken()
      }
    });
  }

  updateUser(user: any): Observable<any> {
    return this.http.patch(apiURL + `/users`, getFormData(user), {
        headers: {
          Authorization: 'Bearer ' + this.jwtHandler.getToken()
        },
      });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(apiURL + `/users/${id}`, {
        headers: {
          Authorization: 'Bearer ' + this.jwtHandler.getToken()
        }
      });
  }
}

import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../app.config";
import {JwtHandler} from "../../identity/jwt.handler";

@Injectable({
  providedIn: 'root'
})
export class AccountDetailsService {
  constructor(private http: HttpClient) {
  }

  fetchUser() {
    return this.http.get(apiURL + '/users/me', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }

  editUser(result: any) {
    return this.http.patch(apiURL + '/users/me', result, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }

  changePassword(result: any) {
    return this.http.patch(apiURL + '/users/me/change-password', {
      oldPassword: result.oldPassword,
      newPassword: result.newPassword,
      confirmPassword: result.confirmPassword
    }, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }
}

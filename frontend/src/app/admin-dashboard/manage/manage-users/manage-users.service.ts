import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../../app.config";
import {BehaviorSubject, lastValueFrom} from "rxjs";
import {getFormData} from "../shared/form-data.handler";
import {IdentityService} from "../../../identity/identity.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class ManageUsersService {
  private userListSubject = new BehaviorSubject<any>({});

  constructor(private http: HttpClient, private identityService: IdentityService, private snackBar: MatSnackBar) {}

  setUsersListSubject(users: any) {
    this.userListSubject.next(users);
  }

  getUsersListSubject() {
    return this.userListSubject;
  }

  async fetchPaginatedUsers(page: number, size: number) {
    try {
      const response = await lastValueFrom(this.http.get(apiURL + '/users', {
        params: {
          page: page.toString(),
          size: size.toString()
        },
        headers: {
          'Authorization': 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.setUsersListSubject(response);
    }
    catch (error) {
      this.snackBar.open('Failed to fetch users', 'Close', {
        duration: 3000,
      });
    }
  }

  async fetchPaginatedUsersFiltered(page: number, size: number, filter: string, search: string) {
    try {
      const response = await lastValueFrom(this.http.get(apiURL + '/users/filtered', {
        params: {
          page: page.toString(),
          size: size.toString(),
          filter: filter,
          search: search
        },
        headers: {
          'Authorization': 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.setUsersListSubject(response);
    }
    catch (error) {
      this.snackBar.open('Failed to fetch users', 'Close', {
        duration: 3000,
      });
    }
  }

  async addUser(user: any, page: number, size: number) {
    try {
      const response = await lastValueFrom(this.http.post(apiURL + '/users', getFormData(user), {
        params: {
          page: page.toString(),
          size: size.toString()
        },
        headers: {
          Authorization: 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.setUsersListSubject(response);
    }
    catch (error) {
      this.snackBar.open('Failed to add user', 'Close', {
        duration: 3000,
      });
    }
  }

  async updateUser(user: any) {
    try {
      const response = await lastValueFrom(this.http.patch(apiURL + `/users`, getFormData(user), {
        headers: {
          Authorization: 'Bearer ' + this.identityService.getToken()
        },
      }));
      let users = this.userListSubject.getValue();
      users.userPage.content.map((u: any) => u.id === user.id ? user : u);
      this.setUsersListSubject(users);
    }
    catch (error) {
      this.snackBar.open('Failed to update user', 'Close', {
        duration: 3000,
      });
    }
  }

  async deleteUser(id: string, page: number, size: number) {
    try {
      const response = await lastValueFrom(this.http.delete(apiURL + `/users/${id}`, {
        params: {
          page: page.toString(),
          size: size.toString()
        },
        headers: {
          Authorization: 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.setUsersListSubject(response);
    }
    catch (error) {
      this.snackBar.open('Failed to delete user', 'Close', {
        duration: 3000,
      });
    }
  }
}

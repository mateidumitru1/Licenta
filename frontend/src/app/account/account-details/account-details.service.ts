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
export class AccountDetailsService {
  private userSubject = new BehaviorSubject<any>({});

  constructor(private http: HttpClient, private identityService: IdentityService, private snackBar: MatSnackBar) {}

  setUser(user: any) {
    this.userSubject.next(user);
  }

  getUser() {
    return this.userSubject.asObservable();
  }

  async fetchUser() {
    try {
      const user: any = await lastValueFrom(this.http.get(apiURL + '/users/me/orders', {
        headers: {
          'Authorization': 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.setUser(user);
    }
    catch (error) {
      this.snackBar.open('Error fetching user data', 'Close', {
        duration: 3000
      });
    }
  }

  async editUser(result: any) {
    try {
      const user = await lastValueFrom(this.http.patch(apiURL + '/users/me', result, {
        headers: {
          'Authorization': 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.setUser(user);
    }
    catch (error) {
      this.snackBar.open('Error editing user data', 'Close', {
        duration: 3000
      });
    }
  }

  async changePassword(result: any) {
    this.http.patch(apiURL + '/users/me/change-password', {
      oldPassword: result.oldPassword,
      newPassword: result.newPassword,
      confirmPassword: result.confirmPassword
    }, {
      headers: {
        'Authorization': 'Bearer ' + this.identityService.getToken()
      }
    }).subscribe({
      next: () => {
        this.snackBar.open('Password changed', 'Close', {
          duration: 3000
        });
      },
      error: (error: any) => {
        this.snackBar.open(error.error, 'Close', {duration: 3000});
      }
    });
  }
}

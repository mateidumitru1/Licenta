import {Injectable} from "@angular/core";
import {BehaviorSubject, lastValueFrom} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {IdentityService} from "../../identity/identity.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {apiURL} from "../../app.config";

@Injectable({
  providedIn: 'root'
})
export class AccountSettingsService {
  userSubject = new BehaviorSubject<any>({});

  constructor(private http: HttpClient,
              private identityService: IdentityService,
              private snackBar: MatSnackBar) {}

  setUser(user: any) {
    this.userSubject.next(user);
  }

  getUser() {
    return this.userSubject.asObservable();
  }

  async fetchUser() {
    const user: any = await lastValueFrom(this.http.get(apiURL + '/users/me/details', {
      headers: {
        'Authorization': 'Bearer ' + this.identityService.getToken()
      }
    }));
    this.setUser(user);
  }

  async editUser(result: any) {
    try {
      const user = await lastValueFrom(this.http.patch(apiURL + '/users/me', result, {
        headers: {
          'Authorization': 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.setUser(user);
      this.snackBar.open('Detaliile au fost actualizate cu succes!', 'Close', {
        duration: 3000
      });
    }
    catch (error) {
      this.snackBar.open('A apărut o eroare la actualizarea detaliilor!', 'Close', {
        duration: 3000
      });
    }
  }

  async changePassword(result: any) {
    try {
      await lastValueFrom(this.http.patch(apiURL + '/users/me/change-password', {
        oldPassword: result.oldPassword,
        newPassword: result.newPassword,
        confirmPassword: result.confirmPassword
      }, {
        headers: {
          'Authorization': 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.snackBar.open('Parola a fost schimbată cu succes!', 'Close', {
        duration: 3000
      });
    }
    catch (error) {
      this.snackBar.open('A apărut o eroare la schimbarea parolei!', 'Close', {
        duration: 3000
      });
    }
  }
}

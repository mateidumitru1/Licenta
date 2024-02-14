import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {JwtHandler} from "../util/handlers/jwt.handler";
import {MatSnackBar} from "@angular/material/snack-bar";
import * as global from "../shared/global";

@Injectable({
  providedIn: 'root'
})
export class IdentityService {

  constructor(private http: HttpClient, private router: Router, private jwtHandler: JwtHandler,
              private snackBar: MatSnackBar) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(global.host + '/authenticate', {
      username: username,
      password: password
    });
  }

  register(firstName: string, lastName: string, username: string, password: string, email: string) {
    this.http.post(global.host + '/register', {
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password,
      email: email
    }).subscribe((response: any) => {
      this.snackBar.open('You have been registered successfully!', 'Close', {
        duration: 3000
      });
      this.router.navigate(['/login']);
    }, (error: any) => {
      this.snackBar.open(error.error.message, 'Close', {
        duration: 3000
      });
    });
  }

  logout() {
    this.http.post(global.host + '/logout', null, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    }).subscribe(() => {
      this.jwtHandler.removeJwt();
      this.router.navigate(['/home']);
      this.snackBar.open('You have been logged out!', 'Close', {
        duration: 3000
      });
    });
  }

  isLoggedIn() {
    return this.jwtHandler.isLoggedIn();
  }

  isAdmin() {
    return this.jwtHandler.isAdmin();
  }

  getUserName() {
    return this.jwtHandler.getUserName();
  }

  forgotPassword(email: string) {
     this.http.post(global.host + '/api/forgot-password?email=' + email, null).subscribe(() => {
        this.snackBar.open('An email has been sent to you!', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/login']);
     }, (error: any) => {
        this.snackBar.open(error.error.message, 'Close', {
          duration: 3000
        });
     });
  }

  resetPassword(token: string, password: string) {
    return this.http.post(global.host + '/reset-password?token=' + token + '&password=' + password, null);
  }

  fetchUserById(userId: any) {
    return this.http.get(global.host + '/users/' + userId, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }
}

import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../app.config";
import {JwtHandler} from "./jwt.handler";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class IdentityService {
  dropDownText: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient, private jwtHandler: JwtHandler, private snackBar: MatSnackBar,
              private router: Router) { }

  login(username: string, password: string) {
    this.http.post(apiURL + '/authenticate', {
      username: username,
      password: password
    }).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        if (this.jwtHandler.getRole() === 'ADMIN') {
          this.router.navigate(['admin-dashboard']);
        } else {
          this.dropDownText.next('Salut, ' + username);
          this.router.navigate(['home']);
        }
      },
      error: (error) => {
        this.snackBar.open('Invalid username or password!', 'Dismiss', {duration: 3000});
      }
    });
  }

  logout() {
    this.http.post(apiURL + '/logout', null, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    }).subscribe({
      next: () => {
        this.router.navigate(['']);
        this.jwtHandler.removeJwt();
        this.dropDownText.next('Login');
        this.snackBar.open('You have been logged out!', 'Close', {
          duration: 3000
        });
      },
      error: (error: any) => {
        this.snackBar.open(error.error, 'Close', {
          duration: 3000
        });
      }
    });
  }

  register(firstName: string, lastName: string, username: string, password: string, email: string) {
    return this.http.post(apiURL + '/register', {
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password,
      email: email
    });
  }

  isLoggedIn() {
    return this.jwtHandler.isLoggedIn();
  }

  isAdmin() {
    return this.jwtHandler.isAdmin();
  }

  forgotPassword(email: string) {
    this.http.post(apiURL + '/forgot-password?email=' + email, null).subscribe({
      next: () => {
        this.snackBar.open('Un email a fost trimis!', 'Close', {
          duration: 3000
        });
      },
      error: (error: any) => {
        this.snackBar.open(error.error.message, 'Close', {
          duration: 300
        });
      }
    });
  }

  resetPassword(token: string, password: string) {
    this.http.post(apiURL + '/reset-password?token=' + token + '&password=' + password, null).subscribe({
      next: () => {
        this.snackBar.open('Parola a fost schimbata!', 'Close', {
          duration: 3000
        });
      },
      error: (error: any) => {
        this.snackBar.open(error.error, 'Close', {
          duration: 3000
        });
      }
    });
  }
}

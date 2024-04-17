import {HostListener, Injectable} from "@angular/core";
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
  constructor(private http: HttpClient, private jwtHandler: JwtHandler, private snackBar: MatSnackBar,
              private router: Router) { }

  login(username: string, password: string, rememberMe: boolean) {
    this.http.post(apiURL + '/authenticate', {
      username: username,
      password: password
    }).subscribe({
      next: (response: any) => {
        this.jwtHandler.setToken(response.token, rememberMe);
        if (this.jwtHandler.getRole() === 'ADMIN') {
          this.router.navigate(['admin-dashboard']);
        } else if(this.jwtHandler.getRole() === 'USER') {
          this.router.navigate(['home']);
        } else {
          this.router.navigate(['validator-dashboard'])
        }
      },
      error: (error) => {
        this.snackBar.open(error.error, 'Dismiss', {duration: 3000});
      }
    });
  }

  logout() {
    this.http.post(apiURL + '/logout', null, {
      headers: {
        'Authorization': 'Bearer ' + this.jwtHandler.getToken()
      }
    }).subscribe({
      next: () => {
        this.router.navigate(['']);
        this.jwtHandler.removeToken();
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
    this.http.post(apiURL + '/register', {
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password,
      email: email
    }).subscribe({
      next: () => {
        this.snackBar.open('Registration successful!', 'Close', {
          duration: 3000
        });
        return true;
      },
      error: (error: any) => {
        this.snackBar.open(error.error, 'Close', {
          duration: 3000
        });
        return false;
      }
    });
  }
  forgotPassword(email: string) {
    this.http.post(apiURL + '/forgot-password?email=' + email, null).subscribe({
      next: () => {
        this.snackBar.open('Un email a fost trimis!', 'Close', {
          duration: 3000
        });
      },
      error: (error: any) => {
        this.snackBar.open(error.error, 'Close', {
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

  verifyAccount(token: string) {
    return this.http.post(apiURL + '/verify-account?token=' + token, null);
  }

  resendVerifyAccountEmail(email: string) {
    return this.http.post(apiURL + '/resend-verify-account-email?email=' + email, null);
  }

  isLoggedIn() {
    return this.jwtHandler.isLoggedIn();
  }

  isUser() {
    return this.jwtHandler.getRole() === 'USER';
  }

  isAdmin() {
    return this.jwtHandler.getRole() === 'ADMIN';
  }

  isValidator() {
    return this.jwtHandler.getRole() === 'TICKET_VALIDATOR';
  }

  getUsername() {
    return this.jwtHandler.getUsername();
  }

  getToken() {
    return this.jwtHandler.getToken();
  }
}

import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {JwtHandler} from "../handlers/jwt.handler";

@Injectable({
  providedIn: 'root'
})
export class IdentityService {

  constructor(private http: HttpClient, private router: Router, private jwtHandler: JwtHandler) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post('http://localhost:8080/api/authenticate', {
      username: username,
      password: password
    });
  }

  register(firstName: string, lastName: string, username: string, password: string, email: string) {

    this.http.post('http://localhost:8080/api/register', {
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password,
      email: email
    }).subscribe((response: any) => {
      console.log(response);
    }, (error: any) => {
      alert(error.error)
    });
  }

  logout() {
    this.http.post('http://localhost:8080/api/logout', null, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    }).subscribe(() => {
      this.jwtHandler.removeJwt();
      this.router.navigate(['/home']);
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
}

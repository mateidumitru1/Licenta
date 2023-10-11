import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

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
}

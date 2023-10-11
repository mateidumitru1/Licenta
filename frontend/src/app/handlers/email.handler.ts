import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class EmailHandler {

  isEmailValid(email: string): boolean {
    const pattern = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$');
    return pattern.test(email);
  }
}

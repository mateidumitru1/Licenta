import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class InputFieldsErrorService {

  subject: Subject<any> = new Subject<any>();
}

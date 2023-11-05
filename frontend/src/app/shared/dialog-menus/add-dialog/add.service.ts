import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AddService{

  subject: Subject<any> = new Subject<any>();

  constructor() {}

}

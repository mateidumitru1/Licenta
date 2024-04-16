import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DropdownService {
  private showDropdownSubject = new BehaviorSubject<boolean>(false);
  showDropdown$ = this.showDropdownSubject.asObservable();

  setShowDropdown(value: boolean): void {
    this.showDropdownSubject.next(value);
  }

  toggleDropdown(): void {
    this.showDropdownSubject.next(!this.showDropdownSubject.value);
  }
}

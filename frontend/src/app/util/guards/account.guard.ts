import {IdentityService} from "../../identity/identity.service";
import {CanActivate, Router} from "@angular/router";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AccountGuard implements CanActivate{
  constructor(private router: Router, private identityService: IdentityService) {}

  canActivate() {
    if (this.identityService.isLoggedIn() && !this.identityService.isAdmin()) {
      return true;
    }
    else {
      this.router.navigate(['']);
      return false;
    }
  }
}

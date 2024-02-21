import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router} from "@angular/router";
import {IdentityService} from "../../identity/identity.service";

@Injectable({
  providedIn: 'root'
})
export class ValidatorGuard implements CanActivate {

  constructor(private identityService: IdentityService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    if(this.identityService.isUser() || !this.identityService.isLoggedIn()) {
      this.router.navigate(['']);
      return false;
    } else if(this.identityService.isAdmin()) {
      this.router.navigate(['admin-dashboard']);
      return false;
    }
    return true;
  }
}

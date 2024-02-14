import {ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {IdentityService} from "../../identity/identity.service";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AccountGuard implements CanActivate {

  constructor(private identityService: IdentityService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    if (this.identityService.isLoggedIn() && !this.identityService.isAdmin()) {
      return true;
    }
    else {
      this.router.navigate(['']);
      return false;
    }
  }
}

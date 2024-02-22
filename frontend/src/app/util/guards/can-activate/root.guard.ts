import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {IdentityService} from "../../../identity/identity.service";

@Injectable({
  providedIn: 'root'
})
export class RootGuard implements CanActivate {
  constructor(private identityService: IdentityService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(this.identityService.isAdmin()) {
      this.router.navigate(['admin-dashboard']);
      return false;
    } else if(this.identityService.isValidator()) {
      this.router.navigate(['validator-dashboard']);
      return false;
    }
    return true;
  }
}

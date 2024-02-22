import {ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {IdentityService} from "../../../identity/identity.service";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private identityService: IdentityService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(this.identityService.isUser() || !this.identityService.isLoggedIn()) {
      this.router.navigate(['']);
      return false;
    } else if(this.identityService.isValidator()) {
      this.router.navigate(['validator-dashboard']);
      return false;
    }
    return true;
  }
}

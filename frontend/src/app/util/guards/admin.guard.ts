import {ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {IdentityService} from "../../identity/identity.service";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private identityService: IdentityService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    if (this.identityService.isAdmin()) {
      return true;
    }
    else {
      this.router.navigate(['']);
      return false;
    }
  }
}

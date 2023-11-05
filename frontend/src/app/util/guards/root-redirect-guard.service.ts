import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot, UrlSegment
} from '@angular/router';
import {IdentityService} from "../../identity/identity.service";
import {Injectable} from "@angular/core";
import {state} from "@angular/animations";

@Injectable({
  providedIn: 'root'
})
export class RootRedirectGuard implements CanActivate {
  constructor(private identityService: IdentityService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.identityService.isAdmin()) {
      this.router.navigate(['/admin-dashboard']);
      return false;
    }
    return true;
  }
}

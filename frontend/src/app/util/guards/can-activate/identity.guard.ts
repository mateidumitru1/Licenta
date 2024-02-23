import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {IdentityService} from "../../../identity/identity.service";

@Injectable({
  providedIn: 'root'
})
export class IdentityGuard implements CanActivate{
  constructor(private router: Router, private identityService: IdentityService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(this.identityService.isLoggedIn()) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
    }
}

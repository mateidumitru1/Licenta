import {IdentityService} from "../../identity/identity.service";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AccountGuard implements CanActivate{
  constructor(private router: Router, private identityService: IdentityService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(!this.identityService.isLoggedIn()) {
      this.router.navigate(['']);
      return false;
    } else if(this.identityService.isAdmin()) {
      this.router.navigate(['admin-dashboard']);
      return false;
    } else if(this.identityService.isValidator()) {
      this.router.navigate(['validator-dashboard']);
      return false;
    }
    return true;
  }
}

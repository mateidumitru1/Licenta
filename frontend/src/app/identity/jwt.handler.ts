import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class JwtHandler {

  constructor() {}

  parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  isLoggedIn() {
    const token = localStorage.getItem('token');
    if (token === null) {
      return false;
    }
    // @ts-ignore
    const jwt = this.parseJwt(token);
    const now = new Date();
    const nowTime = now.getTime() / 1000;
    return jwt.exp > nowTime;
  }

  isAdmin() {
    if(!this.isLoggedIn()) {
      return false;
    }
    return this.getRole() === 'ADMIN';
  }

  removeJwt() {
    localStorage.removeItem('token');
  }

  getRole(): string {
    const token = localStorage.getItem('token');
    if (token === null) {
      return '';
    }
    const jwt = this.parseJwt(token);
    return jwt.role;
  }

  getUserName(): string {
    const token = localStorage.getItem('token');
    if (token === null) {
      return '';
    }
    const jwt = this.parseJwt(token);
    return jwt.sub;
  }
}

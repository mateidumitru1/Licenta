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
    const token = this.getToken();
    if (token === null) {
      return false;
    }
    const jwt = this.parseJwt(token);
    const now = new Date();
    const nowTime = now.getTime() / 1000;
    return jwt.exp > nowTime;
  }

  getRole(): string {
    const token = this.getToken();
    if (token === null) {
      return '';
    }
    const jwt = this.parseJwt(token);
    return jwt.role;
  }

  setToken(token: string, rememberMe: boolean) {
    if(rememberMe) {
      localStorage.setItem('token', token);
    }
    else {
      sessionStorage.setItem('token', token);
    }
  }

  removeToken() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || null;
  }

  getUsername() {
    return this.parseJwt(<string>this.getToken()).sub;
  }
}

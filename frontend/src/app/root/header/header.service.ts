import {Injectable, OnDestroy} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../app.config";
import {BehaviorSubject, lastValueFrom, Subscription} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {IdentityService} from "../../identity/identity.service";

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private locationsSubject = new BehaviorSubject<any>({});
  private shoppingCartSizeSubject = new BehaviorSubject<number>(0);
  private searchResultsSubject = new BehaviorSubject<any>({});

  constructor(private http: HttpClient, private identityService: IdentityService, private snackBar: MatSnackBar) { }

  setLocations(locations: any) {
    this.locationsSubject.next(locations);
  }

  getLocations() {
    return this.locationsSubject.asObservable();
  }

  setShoppingCartSize(shoppingCartSize: number) {
    this.shoppingCartSizeSubject.next(shoppingCartSize);
  }

  getShoppingCartSize() {
    return this.shoppingCartSizeSubject.asObservable();
  }

  setSearchResults(searchResults: any) {
    this.searchResultsSubject.next(searchResults);
  }

  getSearchResults() {
    return this.searchResultsSubject.asObservable();
  }

  async fetchHeaderData() {
    const token = this.identityService.getToken();
    if (!token) {
      try {
        const headerData: any = await lastValueFrom(this.http.get(apiURL + '/header/data'));
        this.setLocations(headerData.locations);
        this.setShoppingCartSize(headerData.shoppingCartSize);
      }
      catch (error) {
        this.snackBar.open('Failed to fetch header data', 'Close', {duration: 3000});
      }
    }
    else {
      try {
        const headerData: any = await lastValueFrom(this.http.get(apiURL + '/header/data', {
          headers: {
            'Authorization': 'Bearer ' + this.identityService.getToken() || ''
          }
        }));
        this.setLocations(headerData.locations);
        this.setShoppingCartSize(headerData.shoppingCartSize);
      }
      catch (error) {
        this.snackBar.open('Failed to fetch header data', 'Close', {duration: 3000});
      }
    }
  }

  async search(searchText: string) {
    try {
      const searchResult: any = await lastValueFrom(this.http.get(apiURL + '/search',{
        params: {
          query: searchText
        }
      }));
      this.setSearchResults(searchResult);
    }
    catch (error) {
      this.snackBar.open('Failed to search', 'Close', {duration: 3000});
    }
  }
}

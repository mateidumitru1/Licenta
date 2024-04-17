import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiURL} from "../../../app.config";
import {BehaviorSubject, lastValueFrom} from "rxjs";
import {IdentityService} from "../../../identity/identity.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class ManageGenresService {
  private genreListSubject = new BehaviorSubject<any>({});

  constructor(private http: HttpClient, private identityService: IdentityService, private snackBar: MatSnackBar) {}

  setGenreList(genreList: any) {
    this.genreListSubject.next(genreList);
  }

  getGenreList() {
    return this.genreListSubject.asObservable();
  }

  async fetchGenres() {
    try {
      const genres = await lastValueFrom(this.http.get(apiURL + '/genres', {
        headers: {
          'Authorization': 'Bearer ' + this.identityService.getToken()
        }
      }));
      this.setGenreList(genres);
    }
    catch (error) {
      this.snackBar.open('Failed to fetch genres', 'Dismiss', {
        duration: 3000
      });
    }
  }
}
